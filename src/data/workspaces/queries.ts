"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getActiveWorkspaceById,
  getWorkspaces,
} from "@/actions/workspaces";

export const useWorkspaces = () => {
  return useQuery({
    queryKey: ["workspace"],
    queryFn: () => getWorkspaces(false),
  });
};

export const useWorkspaceById = (workspaceId?: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getActiveWorkspaceById(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useArchivedWorkspaces = () => {
  return useQuery({
    queryKey: ["workspace", "archived"],
    queryFn: () => getWorkspaces(true),
  });
};
