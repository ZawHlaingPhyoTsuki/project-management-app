"use server";

// import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";

export const deleteWorkspace = async ({
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
      !can(workspaceMember.role, Resource.WORKSPACE, Action.DELETE)
    ) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Delete Workspace
    await prisma.workspace.delete({
      where: { id: workspaceId },
    });

    // Revalidate and redirect after deletion
    // revalidatePath("/dashboard");

    return {
      success: true,
      message: "Workspace deleted successfully",
      data: null,
    };
  } catch (error) {
    console.error("Error fetching workspace:", error);
    return { success: false, data: null, error: "Failed to fetch workspace" };
  }
};
