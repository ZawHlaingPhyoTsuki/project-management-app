/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const createOgranization = async (data: {
  title: string;
  image: string;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: "unauthorized",
    };
  }

  const { title, image } = data;
  let organization;

  try {
    organization = await prisma.organization.create({
      data: {
        title,
        image,
      },
    });
  } catch (error) {
    return {
      error: "organization not created",
    };
  }

  revalidatePath("/");
  return { result: organization };
};

// get users without org
export const getWithoutOrgMembers = async (data: {
  organizationId: string;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: "unauthorized",
    };
  }

  const { organizationId } = data;
  let users;

  try {
    users = await prisma.user.findMany({
      where: {
        NOT: {
          organizations: {
            some: { id: organizationId },
          },
        },
      },
    });
  } catch (error) {
    return {
      error: "user already exist",
    };
  }
  revalidatePath(`/orgnaizations/${organizationId}/members`);
  return { result: users };
};

// update or add member in organization
export const updateOrgMember = async (data: {
  id: string;
  organizationId: string;
  orgIds: any;
  userIds: any;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: "unauthorized",
    };
  }

  const { id, organizationId, orgIds, userIds } = data;
  let updateUser, updateOrg;
  try {
    [updateUser, updateOrg] = await prisma.$transaction([
      prisma.user.update({
        where: { id },
        data: {
          orgIds,
        },
      }),
      prisma.organization.update({
        where: { id: organizationId },
        data: {
          userIds,
        },
      }),
    ]);
  } catch (error) {
    return {
      error: "user already exist",
    };
  }
  revalidatePath(`/orgnaizations/${organizationId}/members`);
  return { result: { updateUser, updateOrg } };
};

// remove org member
export const removeOrgMember = async (data: {
  userId: string;
  organizationId: string;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: "unauthorized",
    };
  }

  const { userId, organizationId } = data;
  try {
    let updateUser, updateOrg;

    const organization: any = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { userIds: true },
    });

    const updateOrgUserIds = organization.userIds.filter(
      (id: string) => id != userId
    );
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        userIds: {
          set: updateOrgUserIds,
        },
      },
    });

    // 2. find users from board
    const boards = await prisma.board.findMany({
      where: { orgId: organizationId },
      select: { id: true, userIds: true },
    });

    for (const board of boards) {
      const updateBoardUserIds = board.userIds.filter((id) => id != userId);

      await prisma.board.update({
        where: {
          id: board.id,
        },
        data: {
          userIds: {
            set: updateBoardUserIds,
          },
        },
      });
      // 3. find users from card
      const cards = await prisma.card.findMany({
        where: { boardId: board.id },
        select: { id: true, users: { select: { id: true } } },
      });

      for (const card of cards) {
        const updateCardUserIds = card.users.filter((user) => user.id != userId);

        await prisma.card.update({
          where: {
            id: card.id,
          },
          data: {
            users: {
              set: updateCardUserIds,
            },
          },
        });
      }
    }
  } catch (error) {
    return {
      error: "user already exist",
    };
  }
  revalidatePath(`/orgnaizations/${organizationId}/members`);
  // return { result: { updateUser, updateOrg } };
};
