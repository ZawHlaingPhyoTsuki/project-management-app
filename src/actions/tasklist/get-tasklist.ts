"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";

export const getTasklistByBoardId = async (boardId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get user's role in the workspace
    const boardMember = await prisma.boardMember.findFirst({
      where: {
        boardId,
        userId: session.user.id,
      },
    });

    if (!boardMember) {
      return { success: false, error: "Access denied" };
    }

    // Check if user has permission to view tasks
    if (!can(boardMember.role, Resource.TASKLIST, Action.VIEW)) {
      return {
        success: false,
        error: "You don't have permission to view tasks",
      };
    }

    const taskLists = await prisma.taskList.findMany({
      where: {
        board: {
          id: boardId,
        },
        isArchived: false,
      },
      include: {
        taskCards: {
          where: {
            isArchived: false,
          },
          include: {
            assignees: true,
            tags: true,
          },
          orderBy: { position: "asc" },
        },
        _count: {
          select: {
            taskCards: true,
          },
        },
      },
      orderBy: { position: "asc" },
    });

    return { success: true, data: taskLists };
  } catch (error) {
    console.error("Error fetching tasklists:", error);
    return { success: false, error: "Failed to fetch tasklists" };
  }
};
