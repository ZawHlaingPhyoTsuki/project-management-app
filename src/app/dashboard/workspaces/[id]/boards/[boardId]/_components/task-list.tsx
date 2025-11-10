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

  return (
    <Card className="w-80 gap-0 pt-2 pb-0">
      <CardHeader className="px-5">
        <CardTitle className="flex items-center justify-between text-lg">
          {title}
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
