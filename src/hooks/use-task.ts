import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  archiveTask,
  createTask,
  deleteTask,
  getArchivedTasksByBoardId,
  restoreTask,
  updateTask,
} from "@/actions/task";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: async (_data, variables) => {
      //   queryClient.invalidateQueries({
      //     queryKey: ["tasks", variables.boardId, variables.workspaceId],
      //   });
      await queryClient.invalidateQueries({
        queryKey: ["task-lists", variables.boardId],
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
        queryKey: ["tasks", variables.boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-lists", variables.boardId],
      });
      toast.success("Task updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });
};

export const useArchiveTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveTask,
    onSuccess: (_data, variables) => {
      // Invalidate both tasks and task-lists queries
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-lists", variables.boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["archived-tasks", variables.boardId],
      });
    },
  });
};

export const useArchivedTasksByBoardId = (boardId: string) => {
  return useQuery({
    queryKey: ["archived-tasks", boardId],
    queryFn: () => getArchivedTasksByBoardId(boardId),
    enabled: !!boardId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_data, variables) => {
      // // Invalidate both tasks and task-lists queries
      // queryClient.invalidateQueries({
      //   queryKey: ["tasks", variables.boardId],
      // });
      // queryClient.invalidateQueries({
      //   queryKey: ["task-lists", variables.boardId],
      // });
      queryClient.invalidateQueries({
        queryKey: ["archived-tasks", variables.boardId],
      });
    },
  });
};

export const useRestoreTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreTask,
    onSuccess: (_data, variables) => {
      // // Invalidate both tasks and task-lists queries
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-lists", variables.boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["archived-tasks", variables.boardId],
      });
    },
  });
};
