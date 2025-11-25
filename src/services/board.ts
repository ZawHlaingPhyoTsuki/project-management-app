/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { createAudLog } from "./audit";
import { ACTION, TABLE_TYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Board, User } from "@/interfaces";
import { headers } from "next/headers";

export const createBoard = async (data: {
  title: string;
  image: string;
  orgId: string;
}) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
  if (!session) {
    return {
      error: "user not found",
    };
  }
  const { title, image, orgId } = data;

  let board;
  try {
    board = await prisma.board.create({
      data: {
        title,
        image,
        orgId,
      },
    });
    await createAudLog({
      tableId: board.id,
      tableTitle: board.title,
      tableType: TABLE_TYPE.BOARD,
      action: ACTION.CREATE,
      orgId,
    });
  } catch (error) {
    return {
      error: "failed to create",
    };
  }
  revalidatePath("/");
  return { result: board };
};

// delete board
export const deleteBoard = async ({
  id,
  orgId,
}: {
  id: string;
  orgId: string;
}) => {
    const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log(session);
  if (!session) {
    return {
      error: "user not found",
    };
  }
  let board;
  try {
    board = await prisma.board.delete({ where: { id } });

    await createAudLog({
      tableId: board.id,
      tableTitle: board.title,
      tableType: TABLE_TYPE.BOARD,
      action: ACTION.DELETE,
      orgId,
    });
  } catch (error) {
    return {
      error: "board not created",
    };
  }

  revalidatePath("/organizations");
  redirect("/organizations");
};

// get member without current board

export const getWithoutBoardMembers = async (data: { board: any }) => {
    const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return {
      error: "user not found",
    };
  }

  const { board } = data;
  let users;

  try {
    users = await prisma.user.findMany({
      where: {
        AND: [
          {
            organizations: {
              some: { id: board.orgId },
            },
          },
          {
            NOT: {
              boards: {
                some: { id: board.id },
              },
            },
          },
        ],
      },
    });
  } catch (error) {
    return {
      error: "board id not exist",
    };
  }
  revalidatePath(`/board/${board.id}`);
  return { result: users };
};

// add memeber in board
export const addMemberInBoard = async (data: { user: User; board: Board }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: "unauthorized",
    };
  }

  const { user, board } = data;
  let updateUser, updateBoard;
  try {
    [updateUser, updateBoard] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          boardIds: user.boardIds,
        },
      }),
      prisma.board.update({
        where: { id: board.id },
        data: {
          userIds: board.userIds,
        },
      }),
    ]);
  } catch (error) {
    return {
      error: "user already exist",
    };
  }
  revalidatePath(`/board/${board.id}`);
  return { result: { updateUser, updateBoard } };
};
