import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTaskList } from "@/actions/tasklist/create-tasklist";
import { getTasklistByBoardId } from "@/actions/tasklist/get-tasklist";

export const useTaskListsByBoardId = (
  boardId: string,
) => {
  return useQuery({
    queryKey: ["task-lists", boardId],
    queryFn: () => getTasklistByBoardId(boardId),
    enabled: !!boardId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateTaskList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskList,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["task-lists", variables.boardId],
      });
    },
  });
};
