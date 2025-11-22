"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTaskList,
  updateTaskList,
  archiveTaskList,
  deleteTaskList,
  restoreTaskList,
} from "@/actions/tasklist";

export const useCreateTaskList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskList,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["board", variables.boardId, "task-lists"],
      });
    },
  });
};

export const useUpdateTaskList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTaskList,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["board", variables.boardId, "task-lists"],
      });
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["board", variables.boardId, "task-lists"],
      });

      const previousTaskLists = queryClient.getQueryData([
        "board",
        variables.boardId,
        "task-lists",
      ]);

      // Optimistic update
      queryClient.setQueryData(
        ["board", variables.boardId, "task-lists"],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (old: any) => {
          if (!old?.success) return old;

          return {
            ...old,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: old.data.map((taskList: any) =>
              taskList.id === variables.id
                ? { ...taskList, name: variables.name }
                : taskList
            ),
          };
        }
      );

      return { previousTaskLists };
    },
    onError: (_error, variables, context) => {
      // Rollback on error
      if (context?.previousTaskLists) {
        queryClient.setQueryData(
          ["board", variables.boardId, "task-lists"],
          context.previousTaskLists
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      // Sync with server
      queryClient.invalidateQueries({
        queryKey: ["board", variables.boardId, "task-lists"],
      });
    },
  });
};

export const useArchiveTaskList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveTaskList,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["board", variables.boardId, "task-lists"],
      });
      queryClient.invalidateQueries({
        queryKey: ["board", variables.boardId, "task-lists", "archived"],
      });
    },
  });
};

export const useDeleteTaskList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTaskList,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["board", variables.boardId, "task-lists"],
      });
      queryClient.invalidateQueries({
        queryKey: ["board", variables.boardId, "task-lists", "archived"],
      });
    },
  });
};

export const useRestoreTaskList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreTaskList,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["board", variables.boardId, "task-lists"],
      });
      queryClient.invalidateQueries({
        queryKey: ["board", variables.boardId, "task-lists", "archived"],
      });
    },
  });
};
