import { useQuery } from "@tanstack/react-query";
import { getAllWorkspaces, getActiveWorkspaceById } from "@/actions/workspaces";

export const useWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getAllWorkspaces,
  });
};

export const useWorkspaceById = (workspaceId?: string) => {
  return useQuery({
    queryKey: ["workspaces", workspaceId],
    queryFn: () => getActiveWorkspaceById(workspaceId),
    enabled: !!workspaceId,
  });
};
