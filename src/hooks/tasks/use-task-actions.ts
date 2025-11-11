import { useConfirmation } from "@/hooks/shared/use-confirmation";
import { useArchiveTask, useDeleteTask } from "@/data/tasks/mutations";

export function useTaskActions() {
  const { mutateAsync: archiveTask } = useArchiveTask();
  const { mutateAsync: deleteTask } = useDeleteTask();

  const archive = useConfirmation({
    mutationFn: archiveTask,
    successMessage: "Task archived successfully",
  });

  const deleteAction = useConfirmation({
    mutationFn: deleteTask,
    successMessage: "Task deleted successfully",
  });

  return {
    archive,
    delete: deleteAction,
  };
}
