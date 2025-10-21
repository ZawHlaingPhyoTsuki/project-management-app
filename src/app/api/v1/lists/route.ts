import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";

// GET /api/v1/lists - Get all task lists
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get boardId from url
    const searchParams = req.nextUrl.searchParams;
    const boardId = searchParams.get("boardId");

    if (!boardId) {
      return Response.json({ error: "Board ID is required" }, { status: 400 });
    }

    // // Check board access
    // const boardMember = await prisma.boardMember.findFirst({
    //   where: {
    //     boardId,
    //     userId: session.user.id,
    //   },
    // });

    // if (!boardMember) {
    //   return Response.json({ error: "Board access denied" }, { status: 403 });
    // }

    const taskLists = await prisma.taskList.findMany({
      where: { boardId },
      include: {
        taskCards: {
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

    return Response.json({ success: true, data: taskLists });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/lists - Create a new task list
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, boardId, position } = await req.json();

    // Validations

    if (!name || !boardId) {
      return Response.json(
        { error: "Name and board ID are required" },
        { status: 400 },
      );
    }

    // Check board access and permissions
    const boardMember = await prisma.boardMember.findFirst({
      where: {
        boardId,
        userId: session.user.id,
      },
    });

    if (!boardMember || !can(boardMember.role, Resource.BOARD, Action.UPDATE)) {
      return Response.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    // Get max position if not provided
    let finalPosition = position;
    if (position === undefined) {
      const lastList = await prisma.taskList.findFirst({
        where: { boardId },
        orderBy: { position: "desc" },
      });
      finalPosition = lastList ? lastList.position + 1 : 0;
    }

    const taskList = await prisma.taskList.create({
      data: {
        name,
        boardId,
        position: finalPosition,
      },
      include: {
        taskCards: {
          orderBy: { position: "asc" },
        },
      },
    });

    return Response.json({ success: true, data: taskList }, { status: 201 });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
