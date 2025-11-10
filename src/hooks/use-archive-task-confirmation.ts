import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useArchiveTask } from "./use-task";

interface useArchiveTaskConfirmationProps {
  taskName: string;
  onSuccess?: () => void;
}

export function useArchiveTaskConfirmation({
  taskName,
  onSuccess,
}: useArchiveTaskConfirmationProps) {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const { mutateAsync: archiveTask, isPending } = useArchiveTask();
  const router = useRouter();

  const handleArchiveTask = async (taskId: string, boardId: string) => {
    try {
      const result = await archiveTask({ taskId, boardId });

      if (result.success) {
        toast.success("Task archived", {
          description: `${taskName} has been successfully archived. You can restore it from the archived section.`,
        });
        setShowArchiveDialog(false);

        // Redirect after successful archive
        // router.push("/dashboard/workspaces");
        router.refresh();

        onSuccess?.();
      } else {
        toast.error("Error", {
          description: result.error || "Failed to archive task",
        });
      }
    } catch (_error) {
      toast.error("An unexpected error occurred");
    }
  };

  return {
    showArchiveDialog,
    setShowArchiveDialog,
    handleArchiveTask,
    isPending,
  };
}
