import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { WorkspaceType } from "@/app/dashboard/workspaces/_components/workspace-list";
import { workspaceService } from "@/services/workspace-service";

export const useWorkspace = (initialData?: WorkspaceType[]) => {
  const queryClient = useQueryClient();

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: workspaceService.getAllWorkspaces,
    initialData: initialData ? { data: initialData } : undefined,
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: workspaceService.createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });

  return {
    workspaces: workspaces?.data as WorkspaceType[] | undefined,
    isLoading,
    createWorkspace: createWorkspaceMutation.mutateAsync,
    isCreating: createWorkspaceMutation.isPending,
  };
};
