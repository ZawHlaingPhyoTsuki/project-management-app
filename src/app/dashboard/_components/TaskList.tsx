import { Ellipsis, Plus } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    <Card className="w-90 flex-shrink-0 gap-0 pt-4 pb-0">
      <CardHeader className="">
        <CardTitle className="flex items-center justify-between font-semibold text-base tracking-widest">
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
          "custom-scrollbar-vertical max-h-[70vh] space-y-4 overflow-y-auto px-4",
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
