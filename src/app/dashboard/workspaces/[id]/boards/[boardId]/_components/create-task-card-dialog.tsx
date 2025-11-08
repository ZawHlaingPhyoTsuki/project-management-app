"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCreateTask } from "@/hooks/use-task";

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
  const [form, setForm] = useState({ title: "", description: "" });

  const { mutate: createTaskCard, isPending } = useCreateTask();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    createTaskCard(
      {
        title: form.title.trim(),
        description: form.description.trim(),
        taskListId,
        boardId,
        workspaceId,
      },
      {
        onSuccess: () => {
          setForm({ title: "", description: "" });
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-normal">
          <Plus/>
          Add a card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Task title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
            <Textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
