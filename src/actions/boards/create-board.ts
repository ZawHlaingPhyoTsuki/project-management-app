"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";
import type { Role } from "../../../prisma/generated/enums";
import { CreateBoardType } from "@/validations/board";
import { revalidatePath } from "next/cache";

export async function createBoard({
  workspaceId,
  name,
  description,
}: CreateBoardType) {
  try {
    // Check Authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user has access to workspace
    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
      },
    });

    if (!workspaceMember) {
      return { success: false, error: "Workspace not found" };
    }

    if (!can(workspaceMember.role, Resource.BOARD, Action.CREATE)) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Create Board and add creator as a member in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create Board
      const board = await tx.board.create({
        data: {
          name,
          description,
          workspaceId,
          createdById: session.user.id,
        },
      });

      // Add creator as a board member with appropriate role
      // If user is OWNER/ADMIN in workspace, give them ADMIN role in board
      // Otherwise, use their workspace role or default to MEMBER
      const boardRole: Role =
        workspaceMember.role === "OWNER" || workspaceMember.role === "ADMIN"
          ? "ADMIN"
          : workspaceMember.role;

      await tx.boardMember.create({
        data: {
          boardId: board.id,
          userId: session.user.id,
          role: boardRole,
        },
      });

      return board;
    });

    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create board" };
  }
}

export async function createBoard2({
  workspaceId,
  name,
  description,
}: {
  workspaceId: string;
  name: string;
  description?: string;
}) {
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

    // Check if user has permission to create a board
    if (!can(workspaceMember.role, Resource.BOARD, Action.CREATE)) {
      return {
        success: false,
        error: "You don't have permission to create boards",
      };
    }

    // Create the board and automatically add the creator as a member
    const board = await prisma.board.create({
      data: {
        name,
        description,
        workspaceId,
        createdById: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role:
              workspaceMember.role === "OWNER" ||
              workspaceMember.role === "ADMIN"
                ? "ADMIN"
                : "MEMBER",
          },
        },
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
    });

    revalidatePath(`/workspaces/${workspaceId}/boards`);
    revalidatePath(`/workspaces/${workspaceId}`);

    return { success: true, data: board };
  } catch (error) {
    console.error("Error creating board:", error);
    return { success: false, error: "Failed to create board" };
  }
}
