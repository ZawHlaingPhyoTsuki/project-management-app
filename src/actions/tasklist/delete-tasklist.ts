"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";
// import { revalidatePath } from "next/cache";

export async function deleteTaskList({
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

    // Check if user has permission to delete the task list
    if (!can(boardMember.role, Resource.TASKLIST, Action.DELETE)) {
      return {
        success: false,
        error: "You don't have permission to delete this task list",
      };
    }

    const board = await prisma.taskList.delete({
      where: {
        id: taskListId,
      },
    });

    // revalidatePath(`/workspaces/${boardMember.board.workspaceId}/boards`);
    // revalidatePath(`/workspaces/${boardMember.board.workspaceId}`);

    return { success: true, data: board };
  } catch (error) {
    console.error("Error deleting task list:", error);
    return { success: false, error: "Failed to delete task list" };
  }
}
