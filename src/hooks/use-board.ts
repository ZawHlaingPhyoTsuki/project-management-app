"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllBoards } from "@/actions/boards/get-board";
import { createBoard2 } from "@/actions/boards/create-board";
import { archiveBoard } from "@/actions/boards/archive-board";
import { restoreBoard } from "@/actions/boards/restore-board";

export const useBoardsByWorkspaceId = (workspaceId: string) => {
  return useQuery({
    queryKey: ["boards", workspaceId],
    queryFn: () => getAllBoards(workspaceId),
    enabled: !!workspaceId,
  });
}

export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBoard2,
    onSuccess: (_data, variables) => {
      // Invalidate and refetch boards for the specific workspace
      queryClient.invalidateQueries({
        queryKey: ["boards", variables.workspaceId],
      });
    },
  });
};

export function useArchiveBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      boardId,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      workspaceId,
    }: {
      boardId: string;
      workspaceId: string;
    }) => archiveBoard(boardId),
    onSuccess: (result, variables) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ["boards", variables.workspaceId],
        });
        queryClient.invalidateQueries({
          queryKey: ["workspace", variables.workspaceId],
        });
      }
    },
  });
}

export function useRestoreBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreBoard,
    onSuccess: (_result, _variables) => {
        queryClient.invalidateQueries({ queryKey: ["boards"] });
        queryClient.invalidateQueries({ queryKey: ["workspace"] });
    },
  });
}