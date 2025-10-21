import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";

// GET /api/v1/lists/:id - Get a task list
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskList = await prisma.taskList.findFirst({
      where: {
        id: id,
        board: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      include: {
        taskCards: {
          include: {
            assignees: true,
          },
          orderBy: { position: "asc" },
        },
        board: {
          select: { id: true, name: true, workspaceId: true },
        },
      },
    });

    if (!taskList) {
      return Response.json({ error: "Task list not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: taskList });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/v1/lists/:id - Update a task list
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskList = await prisma.taskList.findFirst({
      where: {
        id: id,
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
    if (!can(boardMember.role, Resource.BOARD, Action.UPDATE)) {
      return Response.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const { name, position } = await req.json();

    const updatedTaskList = await prisma.taskList.update({
      where: { id: id },
      data: {
        ...(name && { name }),
        ...(position !== undefined && { position }),
      },
      include: {
        taskCards: {
          orderBy: { position: "asc" },
        },
      },
    });

    return Response.json({ success: true, data: updatedTaskList });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/v1/lists/:id - Delete a task list
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskList = await prisma.taskList.findFirst({
      where: {
        id: id,
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
    if (!can(boardMember.role, Resource.BOARD, Action.DELETE)) {
      return Response.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    await prisma.taskList.delete({
      where: { id: id },
    });

    return Response.json({
      success: true,
      message: "Task list deleted successfully",
    });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
