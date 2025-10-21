"use client";

import { Calendar, LoaderCircle, MessageSquare, SquarePen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const AVATARS = [
  {
    src: "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
    fallback: "CN",
    tooltip: "Shadcn",
  },
  {
    src: "https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg",
    fallback: "SK",
    tooltip: "Skyleen",
  },
  {
    src: "https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg",
    fallback: "AW",
    tooltip: "Adam Wathan",
  },
];

interface TaskCardProps {
  task: TaskCardWithAssigneeAndTags;
}

export default function TaskCard({ task }: TaskCardProps) {
  const formatDueDate = (date: Date | string | null): string => {
    if (!date) return "No date";

    // If it's already a Date object
    if (date instanceof Date) {
      return date.getDate().toString();
    }

    // If it's a string, convert to Date first
    if (typeof date === "string") {
      const dateObj = new Date(date);
      return !Number.isNaN(dateObj.getTime())
        ? dateObj.getDate().toString()
        : "Invalid date";
    }

    return "No date";
  };
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
          {task.tags.slice(0, 3).map((tag) => {
            // console.log(tag);
            // const colorClasses = TAG_COLORS[tag.color];
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
          {task.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{task.tags.length - 3}
            </Badge>
          )}
        </div>
        <Separator className="my-4 border border-dashed bg-muted-foreground/40" />
        <div className="flex items-center justify-between">
          {/* Info Badge */}
          <div className="flex gap-2 px-4">
            {task.dueDate ? (
              <Button variant="outline" size="sm" className="h-6 text-xs">
                <Calendar className="mr-1 h-3 w-3" />
                {formatDueDate(task.dueDate)}
              </Button>
            ) : null}
            <Button variant="outline" size="sm" className="h-6 text-xs">
              <MessageSquare className="mr-1 h-3 w-3" />
              {/* {comments} */}dd
            </Button>
            <Button variant="outline" size="sm" className="h-6 text-xs">
              <LoaderCircle className="mr-1 h-3 w-3" />
              {/* {progress} */} progress
            </Button>
          </div>
          {/* Avatars */}
          <div className="flex gap-1 pr-3 cursor-default">
            {AVATARS.slice(0, 2).map((avatar, index) => {
              if (AVATARS.length > 2 && index === 1) {
                return (
                  <Avatar key="more-count" className="size-7">
                    <AvatarFallback className="bg-accent text-xs">
                      +{AVATARS.length - 1}
                    </AvatarFallback>
                  </Avatar>
                );
              }

              return (
                <Avatar key={avatar.src} className="size-7">
                  <AvatarImage src={avatar.src} alt={avatar.tooltip} />
                  <AvatarFallback className="bg-accent text-xs">
                    CN
                  </AvatarFallback>
                </Avatar>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
