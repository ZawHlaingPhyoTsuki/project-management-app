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
