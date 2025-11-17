import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// GET /api/v1/users/:id - Get a user
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

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        workspaceMembers: {
          include: {
            workspace: {
              select: { id: true, name: true },
            },
          },
        },
        boardMembers: {
          include: {
            board: {
              select: { id: true, name: true, workspaceId: true },
            },
          },
        },
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: user });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
