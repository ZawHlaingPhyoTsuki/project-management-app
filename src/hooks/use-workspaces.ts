import { useQuery } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace-service";

export const useTaskLists = () => {
  //   const queryClient = useQueryClient();

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: () => workspaceService.getAllWorkspaces(),
  });

  return {
    workspaces,
    isLoading,
  };
};
