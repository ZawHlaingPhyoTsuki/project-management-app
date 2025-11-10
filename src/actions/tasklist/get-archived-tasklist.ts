"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";

export const getArchivedTaskListsByBoardId = async (boardId: string) => {
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

    if (!can(boardMember.role, Resource.TASKLIST, Action.VIEW)) {
      return {
        success: false,
        error: "You don't have permission to view task lists",
      };
    }

    const archivedTaskLists = await prisma.taskList.findMany({
      where: {
        boardId,
        isArchived: true,
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
      orderBy: { archivedAt: "desc" },
    });

    return { success: true, data: archivedTaskLists };
  } catch (error) {
    console.error("Error fetching archived task lists:", error);
    return { success: false, error: "Failed to fetch archived task lists" };
  }
};

