"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBoard } from "@/actions/create-board";
import { getAllBoards } from "@/actions/get-board";

export const useBoard = (workspaceId: string) => {
  const queryClient = useQueryClient();

  // Get all boards of a specific workspace
  const { data, isLoading, error } = useQuery({
    queryKey: ["boards", workspaceId],
    queryFn: () => getAllBoards(workspaceId),
    enabled: !!workspaceId,
  });

  // Create board
  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: (_data, variables) => {
      // Invalidate and refetch boards for the specific workspace
      queryClient.invalidateQueries({
        queryKey: ["boards", variables.workspaceId],
      });
    },
  });

  return {
    boards: data?.data || [],
    isLoading,
    error,
    createBoard: createBoardMutation.mutateAsync,
    isCreating: createBoardMutation.isPending,
  };
};
