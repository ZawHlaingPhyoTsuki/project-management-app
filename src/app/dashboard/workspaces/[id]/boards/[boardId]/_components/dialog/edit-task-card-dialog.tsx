"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UpdateTaskType } from "@/lib/validations/task";
import { EditTaskForm } from "../form/edit-task-form";
import { toast } from "sonner";
import { useUpdateTask } from "@/data/tasks/mutations";

interface EditTaskCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: {
    id: string;
    title: string;
    description?: string;
  };
  boardId: string;
  workspaceId: string;
}

export default function EditTaskCardDialog({
  open,
  onOpenChange,
  task,
  boardId,
  workspaceId,
}: EditTaskCardDialogProps) {
  const { mutate: updateTask, isPending } = useUpdateTask();

  const handleSubmit = (data: UpdateTaskType) => {
    const updateData: UpdateTaskType = {};

    // Check if title has changed (allow empty strings)
    if (data.title !== undefined && data.title.trim() !== task.title) {
      updateData.title = data.title.trim();
    }

    // Check if description has changed
    if (
      data.description !== undefined &&
      data.description !== task.description
    ) {
      updateData.description = data.description.trim() || "";
    }

    // Check if there are any changes
    if (Object.keys(updateData).length === 0) {
      toast.info("No changes made");
      onOpenChange(false);
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
          onOpenChange(false);
          toast.success("Task updated successfully");
        },
        onError: () => {
          toast.error("Failed to update task");
        },
      }
    );
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
