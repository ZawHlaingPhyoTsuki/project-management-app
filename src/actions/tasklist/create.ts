"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createTaskList({
  name,
  boardId,
  workspaceId,
}: {
  name: string;
  boardId: string;
  workspaceId: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Check if user has access to board
    const boardMember = await prisma.boardMember.findFirst({
      where: {
        board: {
          id: boardId,
          workspaceId,
        },
        userId: session.user.id,
      },
    });

    if (!boardMember) {
      return { success: false, error: "Board not found" };
    }

    // Get max position
    const lastList = await prisma.taskList.findFirst({
      where: { boardId },
      select: { position: true },
      orderBy: { position: "desc" },
    });
    const position = lastList ? lastList.position + 1 : 0;

    const taskList = await prisma.taskList.create({
      data: {
        name,
        boardId,
        position,
      },
      include: {
        taskCards: {
          orderBy: { position: "asc" },
        },
      },
    });

    revalidatePath(`/dashboard/workspace/${workspaceId}/boards/${boardId}`);

    return { success: true, data: taskList };
  } catch (error) {
    console.error("Error creating task list:", error);
    return { success: false, error: "Failed to create task list" };
  }
}
