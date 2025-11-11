import { useArchiveBoard } from "@/data/boards/mutations";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface UseArchiveBoardConfirmationProps {
  boardName: string;
  onSuccess?: () => void;
}

export function useArchiveBoardConfirmation({
  boardName,
  onSuccess,
}: UseArchiveBoardConfirmationProps) {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const { mutateAsync: archiveBoard, isPending } = useArchiveBoard();
  const router = useRouter();

  const handleArchiveBoard = async (boardId: string, workspaceId: string) => {
    try {
      const result = await archiveBoard({ boardId, workspaceId });

      if (result.success) {
        toast.success("Board archived", {
          description: `${boardName} has been successfully archived. You can restore it from the archived section.`,
        });
        setShowArchiveDialog(false);

        // Redirect after successful archive
        // router.push("/dashboard/workspaces");
        router.refresh(); // Refresh to get updated data

        onSuccess?.();
      } else {
        toast.error("Error", {
          description: result.error || "Failed to archive boards",
        });
      }
    } catch (_error) {
      toast.error("An unexpected error occurred");
    }
  };

  return {
    showArchiveDialog,
    setShowArchiveDialog,
    handleArchiveBoard,
    isPending,
  };
}
