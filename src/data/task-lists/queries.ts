"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getTasklistByBoardId,
  getArchivedTaskListsByBoardId,
} from "@/actions/tasklist";

export const useTaskListsByBoardId = (boardId: string) => {
  return useQuery({
    queryKey: ["board", boardId, "task-lists"],
    queryFn: () => getTasklistByBoardId(boardId),
    enabled: !!boardId,
  });
};

export const useArchivedTaskListsByBoardId = (boardId: string) => {
  return useQuery({
    queryKey: ["board", boardId, "task-lists", "archived"],
    queryFn: () => getArchivedTaskListsByBoardId(boardId),
    enabled: !!boardId,
  });
};
