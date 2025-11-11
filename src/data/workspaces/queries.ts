import { useQuery } from "@tanstack/react-query";
import { getAllWorkspaces, getWorkspaceById } from "@/actions/workspaces";

export const useWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getAllWorkspaces,
  });
};

export const useWorkspaceById = (workspaceId?: string) => {
  return useQuery({
    queryKey: ["workspaces", workspaceId],
    queryFn: () => getWorkspaceById(workspaceId),
    enabled: !!workspaceId,
  });
};
