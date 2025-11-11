"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";
// import { revalidatePath } from "next/cache";

export async function updateTaskList({
  id,
  name,
  boardId,
//   workspaceId,
}: {
  id: string;
  name: string;
  boardId: string;
//   workspaceId: string;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const boardMember = await prisma.boardMember.findFirst({
      where: {
        boardId,
        userId: session.user.id,
      },
    });

    if (!boardMember) {
      return { success: false, error: "Access denied" };
    }

    if (!can(boardMember.role, Resource.TASKLIST, Action.UPDATE)) {
      return { success: false, error: "Insufficient permissions" };
    }

    const updatedTaskList = await prisma.taskList.update({
      where: { id },
      data: { name },
    });

    // revalidatePath(`/workspaces/${workspaceId}/boards/${boardId}`);

    return { success: true, data: updatedTaskList };
  } catch (error) {
    console.error("Error updating task list:", error);
    return { success: false, error: "Failed to update task list" };
  }
}
