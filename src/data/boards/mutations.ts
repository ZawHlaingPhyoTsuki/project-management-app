"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBoard2,
  archiveBoard,
  restoreBoard,
  deleteBoard,
} from "@/actions/boards";


export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBoard2,
    onSuccess: (_data, variables) => {
      // Invalidate and refetch boards for the specific workspace
      queryClient.invalidateQueries({
        queryKey: ["boards", variables.workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
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
          queryKey: ["workspaces", variables.workspaceId],
        });
        queryClient.invalidateQueries({
          queryKey: ["archived-boards", variables.workspaceId],
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
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["archived-boards"] });
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBoard,
    onSuccess: (_result, _variables) => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["archived-boards"] });
    },
  });
}
