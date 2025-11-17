import { useQuery } from "@tanstack/react-query";
import { getArchivedTasksByBoardId } from "@/actions/task";

export const useArchivedTasksByBoardId = (boardId: string) => {
  return useQuery({
    queryKey: ["archived-tasks", boardId],
    queryFn: () => getArchivedTasksByBoardId(boardId),
    enabled: !!boardId,
    staleTime: 1000 * 60 * 5,
  });
};
