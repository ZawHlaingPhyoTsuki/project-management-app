import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskListService } from "@/services/tasklist-service";

export const useTaskLists = () => {
  const queryClient = useQueryClient();

  const createTaskListMutation = useMutation({
    mutationFn: taskListService.createTaskList,
    onSuccess: (data, variables) => {
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
