"use client";

import { useQuery } from "@tanstack/react-query";
import {
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

export const useWorkspaceArchivedBoards = (workspaceId: string) => {
  return useQuery({
    queryKey: ["archived-boards", workspaceId],
    queryFn: () => getWorkspaceArchivedBoards(workspaceId),
    enabled: !!workspaceId,
    select: (data) => data?.data ?? [],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
