import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteTaskList } from "./use-task-list";

interface UseDeleteTaskListConfirmationProps {
  taskListName: string;
  onSuccess?: () => void;
}

export function useDeleteTaskListConfirmation({
  taskListName,
  onSuccess,
}: UseDeleteTaskListConfirmationProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutateAsync: deleteTaskList, isPending } = useDeleteTaskList();
  const router = useRouter();

  const handleDeleteTaskList = async (taskListId: string, boardId: string) => {
    try {
      const result = await deleteTaskList({ taskListId, boardId });

      if (result.success) {
        toast.success("Task list deleted", {
          description: `${taskListName} has been permanently deleted.`,
        });
        setShowDeleteDialog(false);

        // Refresh the page to get updated data
        router.refresh();

        onSuccess?.();
      } else {
        toast.error("Error", {
          description: result.error || "Failed to delete task list",
        });
      }
    } catch (_error) {
      toast.error("An unexpected error occurred");
    }
  };

  return {
    showDeleteDialog,
    setShowDeleteDialog,
    handleDeleteTaskList,
    isPending,
  };
}
