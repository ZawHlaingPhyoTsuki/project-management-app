"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";
import { revalidatePath } from "next/cache";

export async function createTask({
  title,
  description,
  taskListId,
  boardId,
  workspaceId,
  dueDate,
}: {
  title: string;
  description?: string;
  taskListId: string;
  boardId: string;
  workspaceId: string;
  dueDate?: Date | string;
}) {
  try {
    // Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check membership and permission
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
      return { success: false, error: "Access denied or board not found" };
    }

    if (!can(boardMember.role, Resource.TASK, Action.CREATE)) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Determine position
    const lastCard = await prisma.taskCard.findFirst({
      where: { taskListId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const position = lastCard ? lastCard.position + 1 : 0;

    // Create task card
    const newTaskCard = await prisma.taskCard.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        position,
        taskListId,
      },
      include: {
        tags: true,
        assignees: {
          include: {
            user: true,
          },
        },
      },
    });

    revalidatePath(`/workspaces/${workspaceId}/boards/${boardId}`);

    return { success: true, data: newTaskCard };
  } catch (error) {
    console.error("❌ Error creating task card:", error);
    return { success: false, error: "Failed to create task" };
  }
}
