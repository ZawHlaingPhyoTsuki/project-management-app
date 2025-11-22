"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBoard2,
  archiveBoard,
  restoreBoard,
  deleteBoard,
} from "@/actions/boards";

export const useCreateBoard = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBoard2,
    onSuccess: (_data, variables) => {
      // Invalidate workspace boards and user boards
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId, "boards"],
      });
      queryClient.invalidateQueries({ queryKey: ["user", userId, "boards"] });
    },
  });
};

export const useArchiveBoard = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveBoard,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId, "boards"] });
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
      queryClient.invalidateQueries({
        queryKey: ["board", variables],
      });
    },
  });
};

export const useRestoreBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreBoard,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
      queryClient.invalidateQueries({ queryKey: ["board", variables] });
    },
  });
};

export const useDeleteBoard = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBoard,
    onSuccess: (_, variables) => {
      // queryClient.invalidateQueries({ queryKey: ["workspace-boards"] });
      // queryClient.invalidateQueries({
      //   queryKey: ["archived-workspace-boards"],
      // });
      queryClient.invalidateQueries({
        queryKey: ["workspace", workspaceId, "boards"],
      });
      // queryClient.invalidateQueries({
      //   queryKey: ["workspace", workspaceId, "boards", "archived"],
      // });
      queryClient.invalidateQueries({ queryKey: ["board", variables.boardId] });
    },
  });
};
