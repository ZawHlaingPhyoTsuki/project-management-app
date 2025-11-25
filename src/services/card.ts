/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/db";
import { createAudLog } from "./audit";
import { ACTION, TABLE_TYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Card, UpdateCard, User } from "@/interfaces";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const cardCreate = async (data: {
  title: string;
  listId: string;
  boardId: string;
}) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
  if (!session) {
    return {
      error: "user not found",
    };
  }
  const { title, listId, boardId } = data;
  let card;

  try {
    const list = await prisma.list.findUnique({
      where: { id: listId },
    });
    if (!list) {
      return {
        error: "List not found",
      };
    }

    const lastCard = await prisma.card.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const order = lastCard ? lastCard.order + 1 : 1;
    card = await prisma.card.create({
      data: {
        title,
        listId,
        boardId,
        order,
      },
    });

    await createAudLog({
      tableId: card.id,
      tableTitle: card.title,
      tableType: TABLE_TYPE.CARD,
      action: ACTION.CREATE,
      orgId: "",
    });
  } catch (error) {
    return {
      error: "card not created",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return { result: card };
};

// udpate card
export const updateDard = async (data: z.infer<typeof UpdateCard>) => {
    const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return {
      error: "user not found",
    };
  }
  const { boardId, id, ...values } = data;
  let card;
  try {
    card = await prisma.card.update({
      where: { id },
      data: { ...values },
    });

    await createAudLog({
      tableId: card.id,
      tableTitle: card.title,
      tableType: TABLE_TYPE.CARD,
      action: ACTION.UPDATE,
      orgId: "",
    });
  } catch (error) {
    return {
      error: "card not updated",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return { result: card };
};

// copy card
export const CardCopy = async (data: { id: string; boardId: string }) => {
    const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return {
      error: "user not found",
    };
  }

  const { id, boardId } = data;
  let card;

  try {
    const getCard = await prisma.card.findUnique({ where: { id } });

    if (!getCard) {
      return {
        error: "card not exist",
      };
    }
    const lastCard = await prisma.card.findFirst({
      where: { listId: getCard?.listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const order = lastCard ? lastCard.order + 1 : 1;
    console.log(lastCard);
    card = await prisma.card.create({
      data: {
        title: `${getCard?.title} - copy`,
        description: getCard?.description,
        listId: getCard.listId,
        boardId,
        order,
      },
    });

    await createAudLog({
      tableId: card.id,
      tableTitle: card.title,
      tableType: TABLE_TYPE.CARD,
      action: ACTION.CREATE,
      orgId: "",
    });
  } catch (error) {
    return {
      error: "card not created",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return { result: card };
};

// delete card
export const CardDelete = async (data: { id: string; boardId: string }) => {
    const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return {
      error: "user not found",
    };
  }

  const { id, boardId } = data;
  let card;
  try {
    card = await prisma.card.delete({
      where: { id },
    });
  } catch (error) {
    return {
      error: "card not deleted",
    };
  }
  await createAudLog({
    tableId: card.id,
    tableTitle: card.title,
    tableType: TABLE_TYPE.CARD,
    action: ACTION.DELETE,
    orgId: "",
  });
  revalidatePath(`/board/${boardId}`);
  return { result: card };
};

// add members in card
export const getWithoutCardMembers = async (data: {
  boardId: string;
  cardId: string;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: "unauthorized",
    };
  }

  const { boardId, cardId } = data;
  let users;
  try {
    console.log("users");
    users = await prisma.user.findMany({
      where: {
        boards: {
          some: { id: boardId },
        },
        NOT: {
          cards: {
            some: { id: cardId },
          },
        },
      },
    });
  } catch (error) {
    return {
      error: "user not found",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return { result: users };
};

// add card members
export const addCardMember = async (data: { user: User; card: Card }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: "unauthorized",
    };
  }

  const { user, card } = data;
  let updateUser, updatecard;
  try {
    [updateUser, updatecard] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          cardIds: user.cardIds,
        },
      }),
      prisma.card.update({
        where: { id: card.id },
        data: {
          userIds: card.userIds,
        },
      }),
    ]);
  } catch (error) {
    return {
      error: "user not found",
    };
  }
  revalidatePath(`/`);
  return { result: { updateUser, updatecard } };
};


// Reorder cards within the same list
export const reorderCards = async (data: { items: any[]; listId: string }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: "unauthorized",
    };
  }

  const { items, listId } = data;
  
  try {
    // Update all cards in a transaction
    const transaction = items.map((card: any) =>
      prisma.card.update({
        where: { id: card.id },
        data: {
          order: card.order,
          listId: listId, // Ensure the card stays in the same list
        },
      })
    );

    const updatedCards = await prisma.$transaction(transaction);

    // Create audit log for the reordering
    await createAudLog({
      tableId: listId,
      tableTitle: "Cards reordered",
      tableType: TABLE_TYPE.CARD,
      action: ACTION.UPDATE,
      orgId: "",
    });

    return { result: updatedCards };
  } catch (error) {
    console.error("Error reordering cards:", error);
    return {
      error: "Failed to reorder cards",
    };
  }
};

// Move card between lists
export const moveCard = async (data: { 
  cardId: string; 
  sourceListId: string; 
  destListId: string;
  newOrder: number;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: "unauthorized",
    };
  }

  const { cardId, sourceListId, destListId, newOrder } = data;
  
  try {
    // First, get the current card
    const card = await prisma.card.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      return {
        error: "Card not found",
      };
    }

    // Update the card with new list and order
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        listId: destListId,
        order: newOrder,
      },
    });

    // Reorder cards in source list (remove the gap)
    const sourceListCards = await prisma.card.findMany({
      where: { listId: sourceListId },
      orderBy: { order: "asc" },
    });

    const updatedSourceCards = sourceListCards
      .filter(card => card.id !== cardId)
      .map((card, index) => ({
        ...card,
        order: index,
      }));

    // Update source list cards order
    const sourceTransaction = updatedSourceCards.map(card =>
      prisma.card.update({
        where: { id: card.id },
        data: { order: card.order },
      })
    );

    // Reorder cards in destination list (make space for new card)
    const destListCards = await prisma.card.findMany({
      where: { listId: destListId },
      orderBy: { order: "asc" },
    });

    const updatedDestCards = destListCards.map(card => {
      if (card.order >= newOrder) {
        return {
          ...card,
          order: card.order + 1,
        };
      }
      return card;
    });

    // Update destination list cards order
    const destTransaction = updatedDestCards.map(card =>
      prisma.card.update({
        where: { id: card.id },
        data: { order: card.order },
      })
    );

    // Execute all updates in a transaction
    await prisma.$transaction([...sourceTransaction, ...destTransaction]);

    // Create audit log for the move
    await createAudLog({
      tableId: cardId,
      tableTitle: `Card moved from list ${sourceListId} to ${destListId}`,
      tableType: TABLE_TYPE.CARD,
      action: ACTION.UPDATE,
      orgId: "",
    });

    revalidatePath(`/board/${card.boardId}`);
    return { result: updatedCard };
  } catch (error) {
    console.error("Error moving card:", error);
    return {
      error: "Failed to move card",
    };
  }
};

// Update card order (simple version for same-list reordering)
export const updateCardOrder = async (data: {
  cardId: string;
  listId: string;
  newOrder: number;
  boardId: string;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: "unauthorized",
    };
  }

  const { cardId, listId, newOrder, boardId } = data;
  
  try {
    // Update the specific card's order
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        order: newOrder,
        listId: listId,
      },
    });

    revalidatePath(`/board/${boardId}`);
    return { result: updatedCard };
  } catch (error) {
    console.error("Error updating card order:", error);
    return {
      error: "Failed to update card order",
    };
  }
};