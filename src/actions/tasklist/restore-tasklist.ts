"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";
// import { revalidatePath } from "next/cache";

export async function restoreTaskList({
  taskListId,
  boardId,
}: {
  taskListId: string;
  boardId: string;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get user's role in the board
    const boardMember = await prisma.boardMember.findFirst({
      where: {
        boardId,
        userId: session.user.id,
      },
    });

    if (!boardMember) {
      return { success: false, error: "Access denied" };
    }

    // Check if user has permission to restore the task list
    if (!can(boardMember.role, Resource.TASKLIST, Action.RESTORE)) {
      return {
        success: false,
        error: "You don't have permission to restore this task list",
      };
    }

    const taskList = await prisma.taskList.update({
      where: {
        id: taskListId,
      },
      data: {
        isArchived: false,
        archivedAt: null,
      },
    });

    // revalidatePath(`/workspaces/${boardMember.board.workspaceId}/boards`);
    // revalidatePath(`/workspaces/${boardMember.board.workspaceId}`);

    return { success: true, data: taskList };
  } catch (error) {
    console.error("Error restoring task list:", error);
    return { success: false, error: "Failed to restore task list" };
  }
}
