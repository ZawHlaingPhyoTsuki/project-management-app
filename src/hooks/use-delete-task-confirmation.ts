import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteTask } from "./use-task";

interface UseDeleteTaskConfirmationProps {
  taskName: string;
  onSuccess?: () => void;
}

export function useDeleteTaskConfirmation({
  taskName,
  onSuccess,
}: UseDeleteTaskConfirmationProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutateAsync: deleteTask, isPending } = useDeleteTask();
  const router = useRouter();

  const handleDeleteTask = async (taskId: string, boardId: string) => {
    try {
      const result = await deleteTask({ taskId, boardId });

      if (result.success) {
        toast.success("Task deleted", {
          description: `${taskName} has been permanently deleted.`,
        });
        setShowDeleteDialog(false);

        // Refresh the page to get updated data
        router.refresh();

        onSuccess?.();
      } else {
        toast.error("Error", {
          description: result.error || "Failed to delete task",
        });
      }
    } catch (_error) {
      toast.error("An unexpected error occurred");
    }
  };

  return {
    showDeleteDialog,
    setShowDeleteDialog,
    handleDeleteTask,
    isPending,
  };
}
