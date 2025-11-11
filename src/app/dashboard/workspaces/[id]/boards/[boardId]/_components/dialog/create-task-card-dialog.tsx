"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CreateTaskType } from "@/lib/validations/task";
import { CreateTaskForm } from "../form/create-task-form";
import { useCreateTask } from "@/data/tasks/mutations";

interface CreateTaskCardDialogProps {
  taskListId: string;
  boardId: string;
  workspaceId: string;
}

export default function CreateTaskCardDialog({
  taskListId,
  boardId,
  workspaceId,
}: CreateTaskCardDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createTaskCard, isPending } = useCreateTask();

  const handleSubmit = (data: CreateTaskType) => {
    createTaskCard(
      {
        title: data.title.trim(),
        description: data.description?.trim() || "",
        taskListId,
        boardId,
        workspaceId,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-normal">
          <Plus />
          Add a card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Add a new task to this task list
          </DialogDescription>
        </DialogHeader>

        <CreateTaskForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          submitButtonText="Create Task"
          onCancel={handleCancel}
          showCancel={true}
        />
      </DialogContent>
    </Dialog>
  );
}
