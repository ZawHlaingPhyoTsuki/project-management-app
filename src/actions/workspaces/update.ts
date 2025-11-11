"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";
import type { Prisma } from "../../../prisma/generated/client";
import { UpdateWorkspaceType } from "@/lib/validations/workspace";

export const updateWorkspace = async ({
  id,
  name,
  description,
}: UpdateWorkspaceType) => {
  // Check Authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }
  try {
    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: id,
        userId: session.user.id,
      },
      select: {
        id: true,
        role: true,
      },
    });

    // Check permission
    if (
      !workspaceMember ||
      !can(workspaceMember.role, Resource.WORKSPACE, Action.UPDATE)
    ) {
      return { success: false, error: "Insufficient permissions" };
    }

    const updateData: Prisma.WorkspaceUpdateInput = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    const workspace = await prisma.workspace.update({
      where: { id },
      data: updateData,
    });

    // Revalidate the settings page & dashboard
    revalidatePath(`/dashboard/workspaces/${id}/settings`);
    revalidatePath("/dashboard");

    return { success: true, data: workspace };
  } catch (error) {
    console.error("Error updating workspace:", error);
    return { success: false, error: "Something went wrong" };
  }
};
