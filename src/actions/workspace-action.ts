"use server";

import prisma from "@/lib/db";

export const getAllWorkspacesAction = async (sessionId: string) => {
  try {
    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId: sessionId,
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

    return { success: true, data: workspaces };
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return { success: false, error: "Failed to fetch workspaces" };
  }
};
