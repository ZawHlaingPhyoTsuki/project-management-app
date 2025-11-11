import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { useDeleteTaskListConfirmation } from "@/hooks/use-delete-tasklist-confirmation";

interface ArchivedTaskListItemProps {
  boardId: string;
  list: {
    id: string;
    name: string;
    archivedAt: Date | null;
    _count: {
      taskCards: number;
    };
  };
}

export function ArchivedTaskListItem({
  boardId,
  list,
}: ArchivedTaskListItemProps) {
  const {
    showDeleteDialog,
    setShowDeleteDialog,
    handleDeleteTaskList,
    isPending: isDeletePending,
  } = useDeleteTaskListConfirmation({ taskListName: list.name });

  return (
    <>
      <Card className="bg-muted/50">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base break-words line-clamp-2">
                {list.name}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="flex-shrink-0">
              {list._count.taskCards} task
              {list._count.taskCards !== 1 ? "s" : ""}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-sm text-muted-foreground">
            <div>
              {list.archivedAt && (
                <span className="whitespace-nowrap">
                  Archived {format(new Date(list.archivedAt), "MMM d, yyyy")}
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm">
                Restore
              </Button>
              <Button
                onClick={() => setShowDeleteDialog(true)}
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
        onConfirm={() => handleDeleteTaskList(list.id, boardId)}
        title="Delete Task List"
        description={`This action will archive "${list.name}". All data will be preserved but moved to trash. You can restore it later if needed.`}
        confirmText="Delete List"
        isPending={isDeletePending}
        requireConfirmation
        expectedText={list.name}
      />
    </>
  );
}
