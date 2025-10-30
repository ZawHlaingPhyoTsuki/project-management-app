"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function createTaskList({
  name,
  boardId,
}: {
  name: string;
  boardId: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  try {
    // Get max position
    const lastList = await prisma.taskList.findFirst({
      where: { boardId },
      select: { position: true },
      orderBy: { position: "desc" },
    });
    const position = lastList ? lastList.position + 1 : 0;

    const taskList = await prisma.taskList.create({
      data: {
        name,
        boardId,
        position,
      },
      include: {
        taskCards: {
          orderBy: { position: "asc" },
        },
      },
    });

    return { success: true, data: taskList };
  } catch (error) {
    console.error("Error creating task list:", error);
    return { success: false, error: "Failed to create task list" };
  }
}
