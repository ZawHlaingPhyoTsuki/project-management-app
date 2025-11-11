import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { TagColor } from "@/lib/utils/tagColors";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { useDeleteTaskConfirmation } from "@/hooks/use-delete-task-confirmation";
import { useRestoreTask } from "@/hooks/use-task";

interface ArchivedTaskItemProps {
  boardId: string;
  task: {
    id: string;
    title: string;
    description: string | null;
    archivedAt: Date | null;
    assignees: {
      id: string;
      taskCardId: string;
      userId: string;
      assignedAt: Date;
      user: {
        id: string;
        name: string;
        image: string | null;
        email: string;
      };
    }[];
    tags: {
      id: string;
      name: string;
      color: TagColor;
      description: string | null;
    }[];
    taskList: {
      id: string;
      name: string;
    };
  };
}

export function ArchivedTaskItem({ boardId, task }: ArchivedTaskItemProps) {
  const {
    showDeleteDialog,
    setShowDeleteDialog,
    handleDeleteTask,
    isPending: isDeletePending,
  } = useDeleteTaskConfirmation({ taskName: task.title });

  const { mutateAsync: restoreTask, isPending: isRestorePending } =
    useRestoreTask();

  return (
    <>
      <Card className="bg-muted/50">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base break-words line-clamp-2">
                {task.title}
              </CardTitle>
              {task.description && (
                <CardDescription className="break-words break-all line-clamp-3 mt-2">
                  {task.description}
                </CardDescription>
              )}
            </div>
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              {task.taskList.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center gap-4">
              {task.archivedAt && (
                <span className="whitespace-nowrap">
                  Archived {format(new Date(task.archivedAt), "MMM d, yyyy")}
                </span>
              )}
              {task.assignees.length > 0 && (
                <span>{task.assignees.length} assignee(s)</span>
              )}
              {task.tags.length > 0 && (
                <div className="flex gap-1">
                  {task.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="text-xs capitalize"
                      style={{
                        borderColor: `var(--color-${tag.color.toLowerCase()})`,
                        color: `var(--color-${tag.color.toLowerCase()})`,
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                  {task.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{task.tags.length - 2} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                onClick={() => restoreTask({ taskId: task.id, boardId })}
                disabled={isRestorePending || isDeletePending}
                variant="outline"
                size="sm"
              >
                Restore
              </Button>
              <Button
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeletePending || isRestorePending}
                variant="destructive"
                size="sm"
              >
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Task List Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => handleDeleteTask(task.id, boardId)}
        title="Delete Task"
        description={`This action will archive "${task.title}". All data will be preserved but moved to trash. You can restore it later if needed.`}
        confirmText="Delete Task"
        isPending={isDeletePending}
        requireConfirmation
        expectedText={task.title}
      />
    </>
  );
}
