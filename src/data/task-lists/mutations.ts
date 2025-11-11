import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTaskList,
  updateTaskList,
  archiveTasklist,
  deleteTaskList,
  restoreTaskList,
} from "@/actions/tasklist";

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

export const useUpdateTaskList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTaskList,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["task-lists", variables.boardId],
      });
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["task-lists", variables.boardId],
      });

      const previousTaskLists = queryClient.getQueryData([
        "task-lists",
        variables.boardId,
      ]);

      // Optimistic update
      queryClient.setQueryData(
        ["task-lists", variables.boardId],
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
          ["task-lists", variables.boardId],
          context.previousTaskLists
        );
      }
    },
    onSettled: () => {
      // Sync with server
      queryClient.invalidateQueries({ queryKey: ["task-lists"] });
    },
  });
};

export const useArchiveTaskList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveTasklist,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["task-lists", variables.boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["archived-task-lists", variables.boardId],
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
        queryKey: ["task-lists", variables.boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["archived-task-lists", variables.boardId],
      });
    },
  });
};

export const useRestoreTaskList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreTaskList,
    onSuccess: (_data, variables) => {
      // queryClient.invalidateQueries({
      //   queryKey: ["tasks", variables.boardId],
      // });
      queryClient.invalidateQueries({
        queryKey: ["task-lists", variables.boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["archived-task-lists", variables.boardId],
      });
    },
  });
};
