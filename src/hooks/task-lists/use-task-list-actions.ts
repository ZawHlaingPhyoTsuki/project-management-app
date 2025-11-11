import { useConfirmation } from "@/hooks/shared/use-confirmation";
import {
  useArchiveTaskList,
  useDeleteTaskList,
} from "@/data/task-lists/mutations";

export function useTaskListActions() {
  const { mutateAsync: archiveTaskList } = useArchiveTaskList();
  const { mutateAsync: deleteTaskList } = useDeleteTaskList();

  const archive = useConfirmation({
    mutationFn: archiveTaskList,
    successMessage: "Task list archived successfully",
  });

  const deleteAction = useConfirmation({
    mutationFn: deleteTaskList,
    successMessage: "Task list deleted successfully",
  });

  return {
    archive,
    delete: deleteAction,
  };
}
