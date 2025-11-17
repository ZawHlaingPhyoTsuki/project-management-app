import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";
import type { Prisma } from "../../../../../prisma/generated/client";

// GET /api/v1/cards - Get all task cards
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const taskListId = searchParams.get("taskListId");
    const boardId = searchParams.get("boardId");

    const where: Prisma.TaskCardWhereInput = {
      taskList: {
        board: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
    };

    if (taskListId) {
      where.taskListId = taskListId;
    }

    if (boardId) {
      where.taskList = { boardId };
    }

    const taskCards = await prisma.taskCard.findMany({
      where,
      include: {
        assignees: true,
        taskList: {
          select: { id: true, name: true, boardId: true },
        },
      },
      orderBy: { position: "asc" },
    });

    return Response.json({ success: true, data: taskCards });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/cards - Create a new task card
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, taskListId, position, dueDate } =
      await req.json();

    if (!title || !taskListId) {
      return Response.json(
        { error: "Title and task list ID are required" },
        { status: 400 },
      );
    }

    // Check task list access and permissions
    const taskList = await prisma.taskList.findFirst({
      where: {
        id: taskListId,
        board: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      include: {
        board: {
          include: {
            members: {
              where: { userId: session.user.id },
            },
          },
        },
      },
    });

    if (!taskList) {
      return Response.json({ error: "Task list not found" }, { status: 404 });
    }

    const boardMember = taskList.board.members[0];
    if (!can(boardMember.role, Resource.TASK, Action.CREATE)) {
      return Response.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    // Get max position if not provided
    let finalPosition = position;
    if (position === undefined) {
      const lastCard = await prisma.taskCard.findFirst({
        where: { taskListId },
        orderBy: { position: "desc" },
      });
      finalPosition = lastCard ? lastCard.position + 1 : 0;
    }

    const taskCard = await prisma.taskCard.create({
      data: {
        title,
        description,
        taskListId,
        position: finalPosition,
        dueDate: dueDate ? new Date(dueDate) : null,
        // assigneeId: assigneeId || null,
      },
      include: {
        assignees: true,
        taskList: {
          select: { id: true, name: true, boardId: true },
        },
      },
    });

    return Response.json({ success: true, data: taskCard }, { status: 201 });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
