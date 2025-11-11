"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { CreateWorkspaceType } from "@/validations/workspace";

export const createWorkspace = async ({
  name,
  description,
}: CreateWorkspaceType) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Not authenticated");
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

    return { success: true, data: workspace };
  } catch (error) {
    console.error("Error fetching workspace:", error);
    return { success: false, data: null, error: "Failed to fetch workspace" };
  }
};
