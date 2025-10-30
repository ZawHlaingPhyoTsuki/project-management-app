import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTaskList } from "@/actions/create-tasklist";

export const useTaskList = () => {
  const queryClient = useQueryClient();

  const createTaskListMutation = useMutation({
    mutationFn: createTaskList,
    onSuccess: (_data, variables) => {
      // Invalidate and refetch task lists for the specific board
      queryClient.invalidateQueries({
        queryKey: ["task-lists", variables.boardId],
      });
    },
  });

  return {
    createTaskList: createTaskListMutation.mutateAsync,
    isCreating: createTaskListMutation.isPending,
  };
};
