"use client";

import { useQuery } from "@tanstack/react-query";
import { getArchivedTasksByBoardId } from "@/actions/task";

export const useArchivedTasksByBoardId = (boardId: string) => {
  return useQuery({
    // queryKey: ["archived-tasks", boardId],
    queryKey: ["board", boardId, "tasks", "archived"],
    queryFn: () => getArchivedTasksByBoardId(boardId),
    enabled: !!boardId,
  });
};
