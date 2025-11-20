"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/app/generated/prisma/client";

export async function updateTask({
  id,
  title,
  description,
  boardId,
  workspaceId,
}: {
  id: string;
  title?: string;
  description?: string;
  boardId: string;
  workspaceId: string;
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

    if (!can(boardMember.role, Resource.TASK, Action.UPDATE)) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Get existing task to verify it exists and belongs to the right board
    const existingTask = await prisma.taskCard.findFirst({
      where: {
        id,
        taskList: {
          boardId: boardId,
        },
      },
      include: {
        taskList: true,
      },
    });

    if (!existingTask) {
      return { success: false, error: "Task not found" };
    }

    // Prepare update data
    const updateData: Prisma.TaskCardUpdateInput = {};

    if (title !== undefined) {
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description.trim() || null; // Convert empty string to null
    }

    // Update task card
    const updatedTask = await prisma.taskCard.update({
      where: { id },
      data: updateData,
    });

    revalidatePath(`/workspaces/${workspaceId}/boards/${boardId}`);

    return { success: true, data: updatedTask };
  } catch (error) {
    console.error("❌ Error updating task card:", error);
    return { success: false, error: "Failed to update task" };
  }
}
