"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCreateTaskList } from "@/hooks/use-task-list";

interface AddTaskListProps {
  boardId: string;
  workspaceId: string;
}

export default function AddTaskList({
  boardId,
  workspaceId,
}: AddTaskListProps) {
  const [listName, setListName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: createTaskList, isPending } = useCreateTaskList();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!listName.trim()) {
      toast.error("Please enter a list name");
      return;
    }

    try {
      await createTaskList({
        name: listName.trim(),
        boardId,
        workspaceId,
      });
      setListName("");
      setIsOpen(false);
      toast.success("Task list created successfully");
    } catch {
      toast.error("Failed to create task list");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-60">
          <Plus /> Add another list
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add List</DialogTitle>
            <DialogDescription>
              Create a new list to organize your tasks.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="Enter list name..."
            className="my-2"
            disabled={isPending}
            autoFocus
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!listName.trim() || isPending}>
              {isPending ? "Adding..." : "Add List"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
