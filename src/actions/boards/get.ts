"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";

export async function getAllBoards(workspaceId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Find All Boards belonging to logged in user in the specific workspace
    const boards = await prisma.board.findMany({
      where: {
        workspaceId: workspaceId,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        workspace: {
          select: { id: true, name: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
        _count: {
          select: {
            taskLists: true,
            members: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: boards };
  } catch (error) {
    console.error("Error fetching boards:", error);
    return { success: false, error: "Failed to fetch boards" };
  }
}

/**
 * Retrieve a board by its ID, including workspace info, members, and counts, and enforce workspace-level view permission for the session user.
 *
 * @param boardId - The ID of the board to fetch
 * @returns An object with `success: true` and `data` set to the board (includes `workspace` with `id` and `name`, `members` with each member's `user` {id, name, email, image}, and `_count` for `taskLists` and `members`) on success; otherwise `success: false` and `error` with a short message
 */
export async function getBoardById(boardId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
      },
      include: {
        workspace: {
          select: { id: true, name: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
        _count: {
          select: {
            taskLists: true,
            members: true,
          },
        },
      },
    });

    if (!board) {
      return { success: false, error: "Board not found" };
    }

    // Get user's role in the workspace
    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: board.workspaceId,
        userId: session.user.id,
      },
    });

    if (!workspaceMember) {
      return { success: false, error: "Access denied" };
    }

    // Check if user has permission to view this specific board
    if (!can(workspaceMember.role, Resource.BOARD, Action.VIEW)) {
      return {
        success: false,
        error: "You don't have permission to view this board",
      };
    }

    return { success: true, data: board };
  } catch (error) {
    console.error("Error fetching board by ID:", error);
    return { success: false, error: "Failed to fetch board" };
  }
}

/**
 * Retrieve all boards in workspaces the specified user is a member of, validating the current session user matches `userId`.
 *
 * @param userId - The ID of the user whose workspace boards to fetch; must equal the authenticated session user's ID
 * @returns On success, an object `{ success: true, data: Board[] }` where each board includes its `workspace` and `_count` for `taskLists` and `members`. On failure, an object `{ success: false, error: string }`.
 */
export async function getAllBoardsByUserId(userId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.id !== userId) {
      return { success: false, error: "Not authenticated" };
    }

    const workspaceMemberships = await prisma.workspaceMember.findMany({
      where: {
        userId: userId,
      },
      select: {
        workspaceId: true,
      },
    });

    const workspaceIds = workspaceMemberships.map(
      (membership) => membership.workspaceId
    );

    if (workspaceIds.length === 0) {
      return { success: true, data: [] };
    }

    const boards = await prisma.board.findMany({
      where: {
        workspaceId: {
          in: workspaceIds,
        },
      },
      include: {
        workspace: true,
        _count: {
          select: {
            taskLists: true,
            members: true,
          },
        },
      },
    });

    return { success: true, data: boards };
  } catch (error) {
    console.error("Error fetching all boards by user ID:", error);
    return { success: false, error: "Failed to fetch boards" };
  }
}

export const getWorkspaceBoards = async (workspaceId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get user's role in the workspace
    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
      },
    });

    if (!workspaceMember) {
      return { success: false, error: "Access denied" };
    }

    // Check if user has permission to view boards
    if (!can(workspaceMember.role, Resource.BOARD, Action.VIEW)) {
      return {
        success: false,
        error: "You don't have permission to view boards",
      };
    }

    const boards = await prisma.board.findMany({
      where: {
        workspaceId,
        isArchived: false,
        // Only show boards where user is a member OR user has workspace access
        OR: [
          {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
          {
            workspace: {
              members: {
                some: {
                  userId: session.user.id,
                },
              },
            },
          },
        ],
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
        _count: {
          select: {
            taskLists: true,
            members: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: boards };
  } catch (error) {
    console.error("Error fetching workspace boards:", error);
    return { success: false, error: "Failed to fetch boards" };
  }
};

export const getWorkspaceArchivedBoards = async (workspaceId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get user's role in the workspace
    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
      },
    });

    if (!workspaceMember) {
      return { success: false, error: "Access denied" };
    }

    // Check if user has permission to view boards
    if (!can(workspaceMember.role, Resource.BOARD, Action.VIEW)) {
      return {
        success: false,
        error: "You don't have permission to view boards",
      };
    }

    const boards = await prisma.board.findMany({
      where: {
        workspaceId,
        isArchived: true,
        // Only show boards where user is a member OR user has workspace access
        OR: [
          {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
          {
            workspace: {
              members: {
                some: {
                  userId: session.user.id,
                },
              },
            },
          },
        ],
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
        _count: {
          select: {
            taskLists: true,
            members: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: boards };
  } catch (error) {
    console.error("Error fetching workspace boards:", error);
    return { success: false, error: "Failed to fetch boards" };
  }
};