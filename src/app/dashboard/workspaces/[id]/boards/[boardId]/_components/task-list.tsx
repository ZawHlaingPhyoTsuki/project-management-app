import * as React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import TaskListEllipsisDropdown from "./task-list-ellipsis-dropdown";
import CreateTaskCardDialog from "./dialog/create-task-card-dialog";
import { InlineEditableTitle } from "@/components/inline-editable-title";
import { useUpdateTaskList } from "@/hooks/use-task-list";
import { toast } from "sonner";

interface TaskListProps extends React.PropsWithChildren {
  className?: string;
  title?: string;
  taskListId: string;
  boardId: string;
  workspaceId: string;
}

export default React.memo(function TaskList({
  className,
  title = "Untitled",
  children,
  taskListId,
  boardId,
  workspaceId,
}: TaskListProps) {
  const hasChildren = React.Children.toArray(children).length > 0;

  const { mutateAsync: updateTaskList, isPending: isSaving } =
    useUpdateTaskList();

  const handleSaveTitle = async (data: {
    title: string;
    taskListId: string;
    boardId: string;
  }) => {
    await updateTaskList({
      id: data.taskListId,
      name: data.title,
      boardId: data.boardId,
    });
    toast.success("Task list updated");
  };

  return (
    <Card className="w-80 gap-0 pt-2 pb-0">
      <CardHeader className="px-5">
        <CardTitle className="flex items-center justify-between text-lg overflow-hidden">
          {/* {title} */}
          <InlineEditableTitle
            title={title}
            taskListId={taskListId}
            boardId={boardId}
            onSave={handleSaveTitle}
            isSaving={isSaving}
            className="flex-1 min-w-0"
          />
          <TaskListEllipsisDropdown />
        </CardTitle>
      </CardHeader>
      {hasChildren && (
        <CardContent
          className={cn(
            className,
            "space-y-4 px-3 pb-3 overflow-y-auto max-h-[70vh] custom-scrollbar-vertical"
          )}
        >
          {children}
        </CardContent>
      )}
      <CardFooter className="pb-3 px-3">
        <CreateTaskCardDialog
          taskListId={taskListId}
          boardId={boardId}
          workspaceId={workspaceId}
        />
      </CardFooter>
    </Card>
  );
});
