import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTaskList } from "@/actions/tasklist/create-tasklist";
import { getTasklistByBoardIdAndWorkspaceId } from "@/actions/tasklist/get-tasklist";

export const useTaskListsByBoardIdAndWorkspaceId = (
  boardId: string,
  workspaceId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any
) => {
  return useQuery({
    queryKey: ["task-lists", boardId, workspaceId],
    queryFn: () => getTasklistByBoardIdAndWorkspaceId(boardId, workspaceId),
    initialData: initialData ? { success: true, data: initialData } : undefined,
    select: (data) => data?.data ?? [],
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateTaskList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskList,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["task-lists", variables.boardId, variables.workspaceId],
      });
    },
  });
};
