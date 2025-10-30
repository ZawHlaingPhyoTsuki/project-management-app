"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import type { Workspace } from "@/types/workspace";

export async function getAllWorkspacesAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  try {
    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId: session?.user.id,
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
}

export const getWorkspaceByIdAction = async (
  workspaceId: string,
): Promise<{
  success: boolean;
  data: Workspace | null;
  error?: string;
}> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Not authenticated");
    }

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
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
        boards: {
          orderBy: { createdAt: "desc" },
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
      return { success: false, data: null, error: "Workspace not found" };
    }

    return { success: true, data: workspace as Workspace };
  } catch (error) {
    console.error("Error fetching workspace:", error);
    return { success: false, data: null, error: "Failed to fetch workspace" };
  }
};
