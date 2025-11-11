import { useConfirmation } from "@/hooks/shared/use-confirmation";
import { useArchiveBoard, useDeleteBoard } from "@/data/boards/mutations";

export function useBoardActions() {
  const { mutateAsync: archiveBoard } = useArchiveBoard();
  const { mutateAsync: deleteBoard } = useDeleteBoard();

  const archive = useConfirmation({
    mutationFn: archiveBoard,
    successMessage: "Board archived successfully",
  });

  const deleteAction = useConfirmation({
    mutationFn: deleteBoard,
    successMessage: "Board deleted successfully",
  });

  return {
    archive,
    delete: deleteAction,
  };
}
