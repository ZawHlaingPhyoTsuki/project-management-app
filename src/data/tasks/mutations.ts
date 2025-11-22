"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  archiveTask,
  createTask,
  deleteTask,
  restoreTask,
  updateTask,
} from "@/actions/task";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["board", variables.boardId, "task-lists"],
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["board", variables.boardId, "task-lists"],
      });
    },
  });
};

export const useArchiveTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveTask,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["board", variables.boardId, "task-lists"],
      });
      queryClient.invalidateQueries({
        queryKey: ["board", variables.boardId, "tasks", "archived"],
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["board", variables.boardId, "task-lists"],
      });
      queryClient.invalidateQueries({
        queryKey: ["board", variables.boardId, "task", "archived"],
      });
    },
  });
};

export const useRestoreTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreTask,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["board", variables.boardId, "task-lists"],
      });
      queryClient.invalidateQueries({
        queryKey: ["board", variables.boardId, "tasks", "archived"],
      });
    },
  });
};
