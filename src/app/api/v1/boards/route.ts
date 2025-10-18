import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";
import type { Prisma } from "../../../../../prisma/generated/client";

// GET /api/v1/boards - Get all boards
/*
  Must Authenticated
  Must be a member of the workspace
*/
export async function GET(req: NextRequest) {
  try {
    // Check Authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get workspaceId from url
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");

    const where: Prisma.BoardWhereInput = {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    };

    if (workspaceId) {
      where.workspaceId = workspaceId;
    }

    // Find All Boards belonging to logged in user
    const boards = await prisma.board.findMany({
      where,
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

    return Response.json({ success: true, data: boards });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/boards - Create a new board
/*
  Must Authenticated
  Must be a member of the workspace
  Must have permission to create a board in the workspace (Owner, Admin, Member of the workspace)
  Create a new board and make the creator (or logged in user) OWNER of the board
*/
export async function POST(req: NextRequest) {
  try {
    // Check Authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, workspaceId } = await req.json();

    if (!name || !workspaceId) {
      return Response.json(
        { error: "Name and workspace ID are required" },
        { status: 400 },
      );
    }

    // Check if user has access to workspace
    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
      },
    });

    if (!workspaceMember) {
      return Response.json(
        { error: "Workspace access denied" },
        { status: 403 },
      );
    }

    // Check if user has permission to create board
    if (!can(workspaceMember.role, Resource.BOARD, Action.CREATE)) {
      return Response.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    // Create Board
    const board = await prisma.board.create({
      data: {
        name,
        description,
        workspaceId,
        members: {
          create: {
            userId: session.user.id,
            role: "ADMIN", // Creator becomes board's admin
          },
        },
        createdById: session.user.id,
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

    return Response.json({ success: true, data: board }, { status: 201 });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
