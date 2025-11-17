import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";

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

    const taskCard = await prisma.taskCard.findFirst({
      where: {
        id,
        taskList: {
          board: {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
        },
      },
      include: {
        assignees: true,
        taskList: {
          select: { id: true, name: true, boardId: true },
        },
      },
    });

    if (!taskCard) {
      return Response.json({ error: "Task card not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: taskCard });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

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

    const taskCard = await prisma.taskCard.findFirst({
      where: {
        id,
        taskList: {
          board: {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
        },
      },
      include: {
        taskList: {
          include: {
            board: {
              include: {
                members: {
                  where: { userId: session.user.id },
                },
              },
            },
          },
        },
      },
    });

    if (!taskCard) {
      return Response.json({ error: "Task card not found" }, { status: 404 });
    }

    const boardMember = taskCard.taskList.board.members[0];
    if (!can(boardMember.role, Resource.TASK, Action.UPDATE)) {
      return Response.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const { title, description, position, dueDate, assigneeId, taskListId } =
      await req.json();

    const updatedTaskCard = await prisma.taskCard.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(position !== undefined && { position }),
        ...(dueDate !== undefined && {
          dueDate: dueDate ? new Date(dueDate) : null,
        }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(taskListId && { taskListId }),
      },
      include: {
        assignees: true,
        taskList: {
          select: { id: true, name: true, boardId: true },
        },
      },
    });

    return Response.json({ success: true, data: updatedTaskCard });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

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

    const taskCard = await prisma.taskCard.findFirst({
      where: {
        id,
        taskList: {
          board: {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
        },
      },
      include: {
        taskList: {
          include: {
            board: {
              include: {
                members: {
                  where: { userId: session.user.id },
                },
              },
            },
          },
        },
      },
    });

    if (!taskCard) {
      return Response.json({ error: "Task card not found" }, { status: 404 });
    }

    const boardMember = taskCard.taskList.board.members[0];
    if (!can(boardMember.role, Resource.TASK, Action.DELETE)) {
      return Response.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    await prisma.taskCard.delete({
      where: { id },
    });

    return Response.json({
      success: true,
      message: "Task card deleted successfully",
    });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
