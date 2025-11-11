import { useDeleteBoard } from "@/data/boards/mutations";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface UseDeleteBoardConfirmationProps {
  boardName: string;
  onSuccess?: () => void;
}

export function useDeleteBoardConfirmation({
  boardName,
  onSuccess,
}: UseDeleteBoardConfirmationProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutateAsync: deleteBoard, isPending } = useDeleteBoard();
  const router = useRouter();

  const handleDeleteBoard = async (boardId: string) => {
    try {
      const result = await deleteBoard({ boardId });

      if (result.success) {
        toast.success("Board deleted", {
          description: `${boardName} has been permanently deleted.`,
        });
        setShowDeleteDialog(false);

        // Refresh the page to get updated data
        router.refresh();

        onSuccess?.();
      } else {
        toast.error("Error", {
          description: result.error || "Failed to delete board",
        });
      }
    } catch (_error) {
      // Error handling is done in the mutation
      toast.error("An unexpected error occurred");
    }
  };

  return {
    showDeleteDialog,
    setShowDeleteDialog,
    handleDeleteBoard,
    isPending,
  };
}
