"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";

export const restoreWorkspace = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
      },
    });

    if (
      !workspaceMember ||
      !can(workspaceMember.role, Resource.WORKSPACE, Action.UPDATE)
    ) {
      return { success: false, error: "Insufficient permissions" };
    }

    const workspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        isArchived: false,
        archivedAt: null,
      },
    });

    // Revalidate relevant paths
    revalidatePath(`/dashboard/workspaces/${workspaceId}`);
    revalidatePath("/dashboard");
    // revalidatePath("/dashboard/archived");

    return {
      success: true,
      message: "Workspace restored successfully",
      data: workspace,
    };
  } catch (error) {
    console.error("Error restoring workspace:", error);
    return { success: false, data: null, error: "Failed to restore workspace" };
  }
};
