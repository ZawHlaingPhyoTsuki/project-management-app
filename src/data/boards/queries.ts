"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAllBoardsByUserId,
  getBoardById,
  getWorkspaceArchivedBoards,
  getWorkspaceBoards,
} from "@/actions/boards";

export const useBoardsByWorkspaceId = (
  workspaceId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any
) => {
  return useQuery({
    queryKey: ["boards", workspaceId],
    queryFn: () => getWorkspaceBoards(workspaceId),
    initialData: initialData ? { success: true, data: initialData } : undefined,
    select: (data) => data?.data ?? [],
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useBoardById = (boardId: string) => {
  return useQuery({
    queryKey: ["board", boardId],
    queryFn: () => getBoardById(boardId),
    enabled: !!boardId,
    // select: (data) => data?.data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAllBoardsByUserId = (userId: string) => {
  return useQuery({
    queryKey: ["boards", userId],
    queryFn: () => getAllBoardsByUserId(userId),
    enabled: !!userId,
    // select: (data) => data?.data ?? [],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useWorkspaceArchivedBoards = (workspaceId: string) => {
  return useQuery({
    queryKey: ["archived-boards", workspaceId],
    queryFn: () => getWorkspaceArchivedBoards(workspaceId),
    enabled: !!workspaceId,
    select: (data) => data?.data ?? [],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
