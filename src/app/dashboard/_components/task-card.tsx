"use client";

import { Calendar, MessageSquare, Plus, SquarePen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getTagColorClasses } from "@/lib/utils/tagColors";
import type { TaskCardWithAssigneeAndTags } from "@/types";

interface TaskCardProps {
  task: TaskCardWithAssigneeAndTags;
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="cursor-grab bg-muted py-4 transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="px-4 pb-3">
        <CardTitle className="flex justify-between items-start gap-2 text-base">
          <span className="flex-1 line-clamp-2 break-words min-w-0">
            {task.title}
          </span>
          <SquarePen
            size={16}
            className="cursor-pointer text-muted-foreground hover:text-foreground flex-shrink-0"
          />
        </CardTitle>
        <CardDescription className="text-sm">
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {/* Dynamic Colored Tags */}
        <div className="flex flex-wrap gap-2 px-4 cursor-default">
          {task.tags?.slice(0, 3).map((tag) => {
            const colorClasses = getTagColorClasses(tag.color);
            return (
              <Badge
                key={tag.id}
                variant="secondary"
                className={cn(
                  "text-xs font-medium border",
                  colorClasses.bg,
                  colorClasses.text,
                )}
              >
                {tag.name}
              </Badge>
            );
          })}
          {task.tags?.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{task.tags.length - 3}
            </Badge>
          )}
        </div>
        <Separator className="my-4 border border-dashed bg-muted-foreground/40" />
        <div className="flex items-center justify-between">
          {/* Info Badge */}
          <InfoBadges task={task} />

          {/* Avatars for multiple assignees */}
          <AssigneeAvatars task={task} />
        </div>
      </CardContent>
    </Card>
  );
}

function InfoBadges({ task }: TaskCardProps) {
  const formatDueDate = (date: Date | string | null): string => {
    if (!date) return "No date";

    if (date instanceof Date) {
      return date.getDate().toString();
    }

    if (typeof date === "string") {
      const dateObj = new Date(date);
      return !Number.isNaN(dateObj.getTime())
        ? dateObj.getDate().toString()
        : "Invalid date";
    }

    return "No date";
  };
  return (
    <div className="flex gap-2 px-4">
      {task.dueDate ? (
        <Button variant="outline" size="sm" className="h-6 text-xs">
          <Calendar className="mr-1 h-3 w-3" />
          {formatDueDate(task.dueDate)}
        </Button>
      ) : null}
      <Button variant="outline" size="sm" className="h-6 text-xs">
        <MessageSquare className="mr-1 h-3 w-3" />
        dd
      </Button>
      {/* <Button variant="outline" size="sm" className="h-6 text-xs">
        <LoaderCircle className="mr-1 h-3 w-3" />
        progress
      </Button> */}
    </div>
  );
}

function AssigneeAvatars({ task }: TaskCardProps) {
  // Safe assignees handling
  const safeAssignees = Array.isArray(task.assignees) ? task.assignees : [];

  // Filter out any potentially undefined assignees
  const validAssignees = safeAssignees.filter(
    (assignee) => assignee && typeof assignee === "object" && "id" in assignee,
  );

  return (
    <div className="flex gap-1 pr-3 cursor-default">
      {validAssignees.slice(0, 2).map((assignee, index) => {
        // Show +count avatar when there are more than 2 assignees
        if (validAssignees.length > 2 && index === 1) {
          return (
            <Avatar key="more-count" className="size-7">
              <AvatarFallback className="bg-accent text-xs">
                +{validAssignees.length - 1}
              </AvatarFallback>
            </Avatar>
          );
        }

        const userInitials =
          assignee.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "U";

        return (
          <Avatar key={assignee.id} className="size-7">
            <AvatarImage
              src={assignee.image || undefined}
              alt={assignee.name || "User"}
            />
            <AvatarFallback className="bg-accent text-xs">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        );
      })}

      {/* Show single avatar when there's only one assignee */}
      {validAssignees.length === 1 &&
        validAssignees.map((assignee) => {
          const userInitials =
            assignee.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "U";

          return (
            <Avatar key={assignee.id} className="size-7">
              <AvatarImage
                src={assignee.image || undefined}
                alt={assignee.name || "User"}
              />
              <AvatarFallback className="bg-accent text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          );
        })}

      {/* Show empty state when no assignees */}
      {validAssignees.length === 0 && (
        <Button variant="outline" size="icon-sm" className="rounded-full">
          <Plus className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
