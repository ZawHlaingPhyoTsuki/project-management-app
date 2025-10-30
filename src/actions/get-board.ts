"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function getAllBoards(workspaceId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Find All Boards belonging to logged in user in the specific workspace
    const boards = await prisma.board.findMany({
      where: {
        workspaceId: workspaceId,
        members: {
          some: {
            userId: session.user.id,
          },
        },
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
        _count: {
          select: {
            taskLists: true,
            members: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: boards };
  } catch (error) {
    console.error("Error fetching boards:", error);
    return { success: false, error: "Failed to fetch boards" };
  }
}
