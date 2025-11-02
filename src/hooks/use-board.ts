"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllBoards } from "@/actions/boards/get-board";
import { createBoard2 } from "@/actions/boards/create-board";
import { archiveBoard } from "@/actions/boards/archive-board";
import { restoreBoard } from "@/actions/boards/restore-board";
import { toast } from "sonner";

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
    mutationFn: archiveBoard,
    onSuccess: (result, _variables) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["boards"] });
        queryClient.invalidateQueries({ queryKey: ["workspace"] });
        toast.success("Board archived successfully");
      } else {
        toast.error(result.error || "Failed to archive board");
      }
    },
    onError: (_error) => {
      toast.error("Failed to archive board");
    },
  });
}

export function useRestoreBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreBoard,
    onSuccess: (result, _variables) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["boards"] });
        queryClient.invalidateQueries({ queryKey: ["workspace"] });
        toast.success("Board restored successfully");
      } else {
        toast.error(result.error || "Failed to restore board");
      }
    },
    onError: (_error) => {
      toast.error("Failed to restore board");
    },
  });
}