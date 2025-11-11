"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";
import { revalidatePath } from "next/cache";

export async function archiveBoard(boardId: string) {
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
      include: {
        board: {
          select: {
            workspaceId: true,
          },
        },
      },
    });

    if (!boardMember) {
      return { success: false, error: "Access denied" };
    }

    // Check if user has permission to archive the board
    if (!can(boardMember.role, Resource.BOARD, Action.ARCHIVE)) {
      return {
        success: false,
        error: "You don't have permission to archive this board",
      };
    }

    const board = await prisma.board.update({
      where: {
        id: boardId,
      },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });

    revalidatePath(`/workspaces/${boardMember.board.workspaceId}/boards`);
    revalidatePath(`/workspaces/${boardMember.board.workspaceId}`);

    return { success: true, data: board };
  } catch (error) {
    console.error("Error archiving board:", error);
    return { success: false, error: "Failed to archive board" };
  }
}
