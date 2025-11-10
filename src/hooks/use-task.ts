import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/actions/task/create-task";
import { toast } from "sonner";
import { updateTask } from "@/actions/task/update-tast";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: async (_data, variables) => {
      //   queryClient.invalidateQueries({
      //     queryKey: ["tasks", variables.boardId, variables.workspaceId],
      //   });
      await queryClient.invalidateQueries({
        queryKey: ["task-lists", variables.boardId, variables.workspaceId],
      });

      toast.success("Task created successfully!");
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: (_data, variables) => {
      // Invalidate both tasks and task-lists queries
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.boardId, variables.workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-lists", variables.boardId, variables.workspaceId],
      });
      toast.success("Task updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });
};
