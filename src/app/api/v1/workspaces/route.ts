import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// GET /api/v1/workspaces - Get all workspaces
export async function GET(_req: NextRequest) {
  try {
    // Check Authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find All Workspaces belonging to logged in user
    const workspaces = await prisma.workspace.findMany({
      where: {
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
              select: { id: true, name: true, email: true, image: true },
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
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ success: true, data: workspaces });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/workspaces - Create a new workspace
export async function POST(req: NextRequest) {
  try {
    // Check Authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create Workspace
    const { name, description } = await req.json();

    if (!name) {
      return Response.json(
        { error: "Workspace name is required" },
        { status: 400 },
      );
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        description,
        createdById: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER",
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
      },
    });

    return Response.json({ success: true, data: workspace }, { status: 201 });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
