import { useConfirmation } from "@/hooks/shared/use-confirmation";
import {
  useArchiveWorkspace,
  useDeleteWorkspace,
} from "@/data/workspaces/mutations";

export function useWorkspaceActions() {
  const { mutateAsync: archiveWorkspace } = useArchiveWorkspace();
  const { mutateAsync: deleteWorkspace } = useDeleteWorkspace();

  const archive = useConfirmation({
    mutationFn: archiveWorkspace,
    successMessage: "Workspace archived successfully",
    redirectOnSuccess: "/dashboard/workspaces",
  });

  const deleteAction = useConfirmation({
    mutationFn: deleteWorkspace,
    successMessage: "Workspace deleted successfully",
    redirectOnSuccess: "/dashboard/workspaces",
  });

  return {
    archive,
    delete: deleteAction,
  };
}
