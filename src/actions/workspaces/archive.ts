"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";

export const archiveWorkspace = async ({
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

    // Find Workspace belonging to logged in user
    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
      },
    });

    // Check Permissions
    if (
      !workspaceMember ||
      !can(workspaceMember.role, Resource.WORKSPACE, Action.UPDATE)
    ) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Archive Workspace (soft delete)
    const workspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });

    // Revalidate relevant paths
    revalidatePath(`/dashboard/workspaces/${workspaceId}/settings`);
    revalidatePath("/dashboard");
    // revalidatePath("/dashboard/archived"); // If you have an archived workspaces page

    return {
      success: true,
      message: "Workspace archived successfully",
      data: workspace,
    };
  } catch (error) {
    console.error("Error archiving workspace:", error);
    return { success: false, data: null, error: "Failed to archive workspace" };
  }
};
