import { Ellipsis, Plus } from "lucide-react";
import type * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface TaskListProps extends React.PropsWithChildren {
  className?: string;
  title?: string;
}

export default function TaskList({
  className,
  title = "Untitled",
  children,
}: TaskListProps) {
  return (
    <Card className="w-100 flex-shrink-0 gap-0 pt-4 pb-0">
      <CardHeader className="">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          {title}
          <div className="flex gap-1">
            <Button size="icon-sm" variant="ghost">
              <Plus />
            </Button>
            <Button size="icon-sm" variant="ghost">
              <Ellipsis />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          className,
          "px-4 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar-vertical",
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
