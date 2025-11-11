import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useArchiveTaskList } from "./use-task-list";

interface useArchiveTasklistConfirmationProps {
  tasklistName: string;
  onSuccess?: () => void;
}

export function useArchiveTasklistConfirmation({
  tasklistName,
  onSuccess,
}: useArchiveTasklistConfirmationProps) {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const { mutateAsync: archiveTasklist, isPending } = useArchiveTaskList();
  const router = useRouter();

  const handleArchiveTasklist = async (taskListId: string, boardId: string) => {
    try {
      const result = await archiveTasklist({ taskListId, boardId });

      if (result.success) {
        toast.success("Task list archived", {
          description: `${tasklistName} has been successfully archived. You can restore it from the archived section.`,
        });
        setShowArchiveDialog(false);

        // Redirect after successful archive
        // router.push("/dashboard/workspaces");
        router.refresh();

        onSuccess?.();
      } else {
        toast.error("Error", {
          description: result.error || "Failed to archive task list",
        });
      }
    } catch (_error) {
      toast.error("An unexpected error occurred");
    }
  };

  return {
    showArchiveDialog,
    setShowArchiveDialog,
    handleArchiveTasklist,
    isPending,
  };
}
