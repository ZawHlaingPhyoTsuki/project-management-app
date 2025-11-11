import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTaskList } from "@/actions/tasklist/create-tasklist";
import { getTasklistByBoardId } from "@/actions/tasklist/get-tasklist";
import { getArchivedTaskListsByBoardId } from "@/actions/tasklist/get-archived-tasklist";
import { updateTaskList } from "@/actions/tasklist/update-tasklist";

export const useTaskListsByBoardId = (boardId: string) => {
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

export const useArchivedTaskListsByBoardId = (boardId: string) => {
  return useQuery({
    queryKey: ["archived-task-lists", boardId],
    queryFn: () => getArchivedTaskListsByBoardId(boardId),
    enabled: !!boardId,
    staleTime: 1000 * 60 * 5,
  });
};
