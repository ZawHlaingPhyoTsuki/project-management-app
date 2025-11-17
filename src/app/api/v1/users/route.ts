import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import type { Prisma } from "../../../../../prisma/generated/client";

// GET /api/v1/users - Get all users
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const workspaceId = searchParams.get("workspaceId");

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // If workspaceId provided, only return users from that workspace
    if (workspaceId) {
      where.workspaceMembers = {
        some: {
          workspaceId,
        },
      };
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
      take: 20,
      orderBy: { name: "asc" },
    });

    return Response.json({ success: true, data: users });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
