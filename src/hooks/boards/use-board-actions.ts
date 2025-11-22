import { useConfirmation } from "@/hooks/shared/use-confirmation";
import { useArchiveBoard, useDeleteBoard } from "@/data/boards/mutations";

interface useBoardActionsProps {
  workspaceId: string;
  userId: string;
}

export function useBoardActions({ workspaceId, userId }: useBoardActionsProps) {
  const { mutateAsync: archiveBoard } = useArchiveBoard(userId);
  const { mutateAsync: deleteBoard } = useDeleteBoard(workspaceId);

  const archiveAction = useConfirmation({
    mutationFn: archiveBoard,
    successMessage: "Board archived successfully",
  });

  const deleteAction = useConfirmation({
    mutationFn: deleteBoard,
    successMessage: "Board deleted successfully",
  });

  return {
    archive: archiveAction,
    delete: deleteAction,
  };
}
