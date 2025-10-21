import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";

// GET /api/v1/boards/:id - Get a board
/**
 * Must Authenticated
 * Must be a member of the board
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Check Authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find Board belonging to logged in user
    const board = await prisma.board.findFirst({
      where: {
        id: id,
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
        taskLists: {
          include: {
            taskCards: {
              include: {
                assignees: true,
              },
              orderBy: { position: "asc" },
            },
          },
          orderBy: { position: "asc" },
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
      return Response.json({ error: "Board not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: board });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/v1/boards/:id - Update a board
/*
 * Must Authenticated
 * Must be a member of the board
 * Update name, description (OWNER, ADMIN, MEMBER)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Check Authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const boardMember = await prisma.boardMember.findFirst({
      where: {
        boardId: id,
        userId: session.user.id,
      },
    });

    if (!boardMember || !can(boardMember.role, Resource.BOARD, Action.UPDATE)) {
      return Response.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const { name, description } = await req.json();

    const board = await prisma.board.update({
      where: { id: id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
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
      },
    });

    return Response.json({ success: true, data: board });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/v1/boards/:id - Delete a board
/*
 * Must Authenticated
 * Must be a member of the board
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Check Authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const boardMember = await prisma.boardMember.findFirst({
      where: {
        boardId: id,
        userId: session.user.id,
      },
    });

    // Check board access and permissions
    if (!boardMember || !can(boardMember.role, Resource.BOARD, Action.DELETE)) {
      return Response.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    await prisma.board.delete({
      where: { id: id },
    });

    return Response.json({
      success: true,
      message: "Board deleted successfully",
    });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
