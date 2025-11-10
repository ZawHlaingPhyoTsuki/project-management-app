"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pen } from "lucide-react";
import { toast } from "sonner";
import { UpdateTaskType } from "@/validations/task";
import { EditTaskForm } from "../form/edit-task-form";
import { useUpdateTask } from "@/hooks/use-task";

interface EditTaskCardDialogProps {
  task: {
    id: string;
    title: string;
    description?: string;
  };
  boardId: string;
  workspaceId: string;
  trigger?: React.ReactNode;
}

export default function EditTaskCardDialog({
  task,
  boardId,
  workspaceId,
  trigger,
}: EditTaskCardDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: updateTask, isPending } = useUpdateTask();

  const handleSubmit = (data: UpdateTaskType) => {
    const updateData: UpdateTaskType = {};

    if (data.title && data.title.trim() !== task.title) {
      updateData.title = data.title.trim();
    }

    if (
      data.description !== undefined &&
      data.description !== task.description
    ) {
      updateData.description = data.description.trim() || "";
    }

    // Check if there are any changes
    if (Object.keys(updateData).length === 0) {
      toast.info("No changes made");
      setOpen(false);
      return;
    }

    updateTask(
      {
        id: task.id,
        boardId,
        workspaceId,
        ...updateData,
      },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success("Task updated successfully");
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
        {trigger || (
          <Button variant="ghost" size="sm">
            <Pen className="h-4 w-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <EditTaskForm
          defaultValues={{
            title: task.title,
            description: task.description || "",
          }}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          submitButtonText="Update Task"
          onCancel={handleCancel}
          showCancel={true}
        />
      </DialogContent>
    </Dialog>
  );
}
