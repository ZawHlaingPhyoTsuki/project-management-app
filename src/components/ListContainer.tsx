/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { List } from "@/interfaces";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import ListItem from "./ListItem";
import CreateList from "./CreateList";
import { reorderList } from "@/services/list";
import { reorderCards, moveCard } from "@/services/card"; 

interface ListProps {
  boardId: string;
  list: any;
}

const reOrderData = (list: any, desIndex: number, sourceIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(sourceIndex, 1);
  result.splice(desIndex, 0, removed);
  return result;
};

const ListContainer = ({ boardId, list }: ListProps) => {
  const [listData, setListData] = useState(list);

  useEffect(() => {
    setListData(list);
  }, [list]);

  const onDragNDrop = async (result: any) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handle list reordering
    if (type === "list") {
      const data = reOrderData(listData, destination.index, source.index).map(
        (item: any, index: number) => ({ ...item, order: index })
      );
      setListData(data);
      await reorderList({ items: data, boardId });
    }

    // Handle card reordering within the same list
    if (type === "card" && source.droppableId === destination.droppableId) {
      const listIndex = listData.findIndex(
        (list: List) => list.id === source.droppableId
      );
      if (listIndex === -1) return;

      const currentList = { ...listData[listIndex] };
      const reorderedCards = reOrderData(
        currentList.cards,
        destination.index,
        source.index
      ).map((card: any, index: number) => ({ ...card, order: index }));

      const updatedListData = [...listData];
      updatedListData[listIndex] = {
        ...currentList,
        cards: reorderedCards,
      };

      setListData(updatedListData);

      // Call API to update card order in database
      await reorderCards({
        items: reorderedCards,
        listId: source.droppableId,
      });
    }

    // Handle card moving between lists
    if (type === "card" && source.droppableId !== destination.droppableId) {
      const sourceListIndex = listData.findIndex(
        (list: List) => list.id === source.droppableId
      );
      const destListIndex = listData.findIndex(
        (list: List) => list.id === destination.droppableId
      );

      if (sourceListIndex === -1 || destListIndex === -1) return;

      const sourceList = { ...listData[sourceListIndex] };
      const destList = { ...listData[destListIndex] };

      // Remove card from source list
      const [movedCard] = sourceList.cards.splice(source.index, 1);

      // Add card to destination list at the correct position
      const updatedMovedCard = {
        ...movedCard,
        listId: destination.droppableId,
      };

      destList.cards.splice(destination.index, 0, updatedMovedCard);

      // Update orders for both lists
      sourceList.cards = sourceList.cards.map((card: any, index: number) => ({
        ...card,
        order: index,
      }));

      destList.cards = destList.cards.map((card: any, index: number) => ({
        ...card,
        order: index,
      }));

      const updatedListData = [...listData];
      updatedListData[sourceListIndex] = sourceList;
      updatedListData[destListIndex] = destList;

      setListData(updatedListData);

      // Call API to move card between lists
      await moveCard({
        cardId: movedCard.id,
        sourceListId: source.droppableId,
        destListId: destination.droppableId,
        newOrder: destination.index,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragNDrop}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {listData?.map((list: List, index: number) => (
              <ListItem key={list.id} list={list} index={index} />
            ))}
            {provided.placeholder}
            <CreateList boardId={boardId} />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;
