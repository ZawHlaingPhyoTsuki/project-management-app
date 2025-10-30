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
import { Label } from "@/components/ui/label";
import { useTaskLists } from "@/hooks/use-task-list";
import { useBoardStore } from "@/store/use-board-store";

export default function AddTaskList() {
  const [listName, setListName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { currentBoardId } = useBoardStore();
  const { createTaskList, isCreating } = useTaskLists();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!listName.trim() || !currentBoardId) {
      return;
    }

    try {
      console.log("here");
      const s = await createTaskList({
        name: listName.trim(),
        boardId: currentBoardId,
      });

      console.log("ehereee", s);

      setListName("");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create task list:", error);
      // You can add toast notification here
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button className="w-60" type="button">
            <Plus /> Add another list
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add List</DialogTitle>
            <DialogDescription>
              Create a new list to organize your tasks. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">List Name</Label>
              <Input
                id="name"
                name="name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Enter list name..."
                disabled={isCreating}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isCreating}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!listName.trim() || !currentBoardId || isCreating}
            >
              {isCreating ? "Adding..." : "Add List"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
