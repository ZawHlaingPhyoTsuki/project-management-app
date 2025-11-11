import { useQuery } from "@tanstack/react-query";
import {
  getTasklistByBoardId,
  getArchivedTaskListsByBoardId,
} from "@/actions/tasklist";

export const useTaskListsByBoardId = (boardId: string) => {
  return useQuery({
    queryKey: ["task-lists", boardId],
    queryFn: () => getTasklistByBoardId(boardId),
    enabled: !!boardId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useArchivedTaskListsByBoardId = (boardId: string) => {
  return useQuery({
    queryKey: ["archived-task-lists", boardId],
    queryFn: () => getArchivedTaskListsByBoardId(boardId),
    enabled: !!boardId,
    staleTime: 1000 * 60 * 5,
  });
};
