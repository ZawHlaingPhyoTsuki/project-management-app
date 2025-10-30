import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWorkspace,
  deleteWorkspace,
  getAllWorkspacesAction,
} from "@/actions/workspaces";

export interface WorkspaceType {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  _count: {
    members: number;
    boards: number;
  };
  members: Array<{
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  }>;
}

export const useWorkspace = () => {
  const queryClient = useQueryClient();

  // Get all workspaces
  const { data: workspaces, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: getAllWorkspacesAction,
  });

  // Create a new workspace
  const createWorkspaceMutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });

  // Delete a workspace
  const deleteWorkspaceMutation = useMutation({
    mutationFn: deleteWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });

  return {
    workspaces: workspaces?.data as WorkspaceType[] | undefined,
    isLoading,
    createWorkspace: createWorkspaceMutation.mutateAsync,
    isCreating: createWorkspaceMutation.isPending,
    deleteWorkspace: deleteWorkspaceMutation.mutateAsync,
    isDeleting: deleteWorkspaceMutation.isPending,
  };
};
