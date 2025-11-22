"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAllWorkspaces,
  getActiveWorkspaceById,
  getArchivedWorkspaces,
} from "@/actions/workspaces";

export const useWorkspaces = () => {
  return useQuery({
    queryKey: ["workspace"],
    queryFn: getAllWorkspaces,
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
    queryFn: getArchivedWorkspaces,
  });
};
