"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAllBoardsByUserId,
  getBoardById,
  getWorkspaceArchivedBoards,
  getWorkspaceBoards,
} from "@/actions/boards";

// Get boards for a specific workspace
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useWorkspaceBoards = (workspaceId: string, initialData?: any) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "boards"],
    queryFn: () => getWorkspaceBoards(workspaceId),
    initialData: initialData ? { success: true, data: initialData } : undefined,
    enabled: !!workspaceId,
  });
};

// Get archived boards for a workspace
export const useArchivedWorkspaceBoards = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "boards", "archived"],
    queryFn: () => getWorkspaceArchivedBoards(workspaceId),
    enabled: !!workspaceId,
  });
};

// Get a single board by ID
export const useBoardById = (boardId?: string) => {
  return useQuery({
    queryKey: ["board", boardId],
    queryFn: () => (boardId ? getBoardById(boardId) : Promise.resolve(null)),
    enabled: !!boardId,
  });
};

// Get all boards for a user (across all workspaces)
export const useUserBoards = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId, "boards"],
    queryFn: () => getAllBoardsByUserId(userId),
    enabled: !!userId,
  });
};
