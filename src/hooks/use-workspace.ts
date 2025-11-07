import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWorkspace,
  deleteWorkspace,
  getAllWorkspaces,
  getWorkspaceById,
  updateWorkspace,
} from "@/actions/workspaces";
import { archiveWorkspace } from "@/actions/workspaces/archive-workspace";
import { restoreWorkspace } from "@/actions/workspaces/restore-workspace";

// export interface WorkspaceType {
//   id: string;
//   name: string;
//   description?: string | null;
//   createdAt: Date;
//   _count: {
//     members: number;
//     boards: number;
//   };
//   members: Array<{
//     user: {
//       id: string;
//       name: string | null;
//       email: string;
//       image: string | null;
//     };
//   }>;
// }

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

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWorkspace,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces", variables.id] });
    },
  });
};

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};

export const useArchiveWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveWorkspace,
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId],
      });
      // queryClient.invalidateQueries({ queryKey: ["archived-workspaces"] });
    },
  });
};

export const useRestoreWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreWorkspace,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId],
      });
      // queryClient.invalidateQueries({ queryKey: ["archived-workspaces"] });
    },
  });
};
