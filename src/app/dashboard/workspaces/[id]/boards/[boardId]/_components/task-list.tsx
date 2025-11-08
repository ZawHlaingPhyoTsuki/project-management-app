import { Ellipsis } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CreateTaskCardDialog from "./create-task-card-dialog";

interface TaskListProps extends React.PropsWithChildren {
  className?: string;
  title?: string;
  taskListId: string;
  boardId: string;
  workspaceId: string;
}

export default function TaskList({
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
      <CardHeader className="">
        <CardTitle className="flex items-center justify-between font-semibold text-base tracking-widest">
          {title}
          <div className="flex gap-1">
            <CreateTaskCardDialog
              taskListId={taskListId}
              boardId={boardId}
              workspaceId={workspaceId}
            />
            <Button size="icon-sm" variant="ghost">
              <Ellipsis />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      {hasChildren && (
        <CardContent
          className={cn(
            className,
            "space-y-4 px-4 pb-4 overflow-y-auto max-h-[80vh] custom-scrollbar-vertical"
          )}
        >
          {children}
        </CardContent>
      )}
    </Card>
  );
}
