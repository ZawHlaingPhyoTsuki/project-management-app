import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";

// GET /api/v1/boards/:id/members - Get all members of a board
/*
  Must Authenticated
  Must be a member of the board
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

    const boardMember = await prisma.boardMember.findFirst({
      where: {
        boardId: id,
        userId: session.user.id,
      },
    });

    if (!boardMember) {
      return Response.json({ error: "Board not found" }, { status: 404 });
    }

    const members = await prisma.boardMember.findMany({
      where: { boardId: id },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { role: "asc" },
    });

    return Response.json({ success: true, data: members });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/boards/:id/members - Invite a user to a board
/*
  Must Authenticated
  Must be a member of the board
*/
export async function POST(
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

    if (!boardMember || !can(boardMember.role, Resource.BOARD, Action.INVITE)) {
      return Response.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const { userId, role } = await req.json();

    // Validation

    const board = await prisma.board.findUnique({
      where: { id: id },
      include: { workspace: true },
    });

    if (!board) {
      return Response.json({ error: "Board not found" }, { status: 404 });
    }

    // Check if user is member of workspace
    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: board.workspaceId,
        userId: userId,
      },
    });

    if (!workspaceMember) {
      return Response.json(
        { error: "User must be a workspace member first" },
        { status: 400 },
      );
    }

    // Add user to board
    const newMember = await prisma.boardMember.upsert({
      where: {
        boardId_userId: {
          boardId: id,
          userId: userId,
        },
      },
      update: { role },
      create: {
        boardId: id,
        userId: userId,
        role,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return Response.json({
      success: true,
      data: newMember,
      message: "User added to board",
    });
  } catch (error) {
    console.error("Add board member error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
