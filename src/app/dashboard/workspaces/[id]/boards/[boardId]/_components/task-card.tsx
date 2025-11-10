"use client";

import {
  SquarePen,
  Circle,
  TextAlignStart,
  Eye,
  Clock,
  Archive,
} from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditTaskCardDialog from "./dialog/edit-task-card-dialog";
// import type { TaskCardWithAssigneeAndTags } from "@/types";

interface TaskCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  task: any;
  boardId: string;
  workspaceId: string;
}

export default function TaskCard({
  task,
  boardId,
  workspaceId,
}: TaskCardProps) {
  return (
    <Card className="group hover:cursor-pointer bg-muted py-2 transition-shadow duration-200 hover:shadow-md gap-0 dark:hover:border-foreground">
      <CardContent className="px-4">
        <CardTitle className="flex justify-between items-start gap-2 text-base">
          <div className="flex items-center gap-2 flex-1 min-w-0 relative">
            <Circle
              size={16}
              className="cursor-pointer text-muted-foreground hover:text-foreground flex-shrink-0 absolute left-0 opacity-0 group-hover:opacity-100 transition-all duration-200"
            />
            <span className="flex-1 line-clamp-2 break-words min-w-0 transition-all duration-200 group-hover:translate-x-6 group-hover:pr-6">
              {task.title}
            </span>
          </div>
          <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ArchiveTag />
            <EditTag task={task} boardId={boardId} workspaceId={workspaceId} />
          </div>
        </CardTitle>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center mt-2">
            {/* Eye Icon */}
            <EyeTag />
            {/* Calender Icon */}
            <CalenderTag />
            {/* Description Icon */}
            <DescriptionTag />
          </div>
          <div className="flex gap-1">
            <AssigneeAvatar />
            <AssigneeAvatar />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface EditTaskProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  task: any;
  boardId: string;
  workspaceId: string;
}

function EditTag({ task, boardId, workspaceId }: EditTaskProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <EditTaskCardDialog
          task={task}
          boardId={boardId}
          workspaceId={workspaceId}
          trigger={
            <SquarePen
              size={16}
              className="cursor-pointer text-muted-foreground hover:text-foreground flex-shrink-0 transition-colors duration-200 z-10"
            />
          }
        />
      </TooltipTrigger>
      <TooltipContent>Edit card</TooltipContent>
    </Tooltip>
  );
}

function ArchiveTag() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Archive
          size={16}
          className="cursor-pointer text-muted-foreground hover:text-foreground flex-shrink-0 transition-colors duration-200 z-10"
        />
      </TooltipTrigger>
      <TooltipContent>Archive card</TooltipContent>
    </Tooltip>
  );
}

function EyeTag() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Eye className="w-4 h-4" />
      </TooltipTrigger>
      <TooltipContent>You are watching this card</TooltipContent>
    </Tooltip>
  );
}

function CalenderTag() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex items-center gap-1 bg-lime-600 rounded-md px-2 py-1 text-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-xs ">30 Oct</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>This card is complete</TooltipContent>
    </Tooltip>
  );
}

function DescriptionTag() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <TextAlignStart className="w-4 h-4" />
      </TooltipTrigger>
      <TooltipContent>This card has a description</TooltipContent>
    </Tooltip>
  );
}

function AssigneeAvatar() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Avatar className="size-7">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent>Shadcn</TooltipContent>
    </Tooltip>
  );
}
