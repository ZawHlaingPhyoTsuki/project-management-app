import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";

// GET /api/v1/workspaces/:id - Get a workspace
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check Authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find Workspace belonging to logged in user
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: params.id,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        boards: {
          include: {
            _count: {
              select: {
                taskLists: true,
                members: true,
              },
            },
          },
        },
        _count: {
          select: {
            boards: true,
            members: true,
          },
        },
      },
    });

    if (!workspace) {
      return Response.json({ error: "Workspace not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: workspace });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/v1/workspaces/:id - Update a workspace
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check Authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check Permissions
    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: params.id,
        userId: session.user.id,
      },
    });

    if (
      !workspaceMember ||
      !can(workspaceMember.role, Resource.WORKSPACE, Action.UPDATE)
    ) {
      return Response.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    // Update Workspace
    const { name, description } = await req.json();

    const workspace = await prisma.workspace.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
      },
    });

    return Response.json({ success: true, data: workspace });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/v1/workspaces/:id - Delete a workspace
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check Authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check Permissions
    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: params.id,
        userId: session.user.id,
      },
    });

    if (
      !workspaceMember ||
      !can(workspaceMember.role, Resource.WORKSPACE, Action.DELETE)
    ) {
      return Response.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    // Delete Workspace
    await prisma.workspace.delete({
      where: { id: params.id },
    });

    return Response.json({
      success: true,
      message: "Workspace deleted successfully",
    });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
