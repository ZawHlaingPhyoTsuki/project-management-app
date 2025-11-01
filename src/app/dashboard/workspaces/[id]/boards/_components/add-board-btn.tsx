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
import { Textarea } from "@/components/ui/textarea";
import { useBoard } from "@/hooks/use-board";
import { useBoardStore } from "@/store/use-board-store";

interface AddBoardBtnProps {
  workspaceId: string;
}

export default function AddBoardBtn({ workspaceId }: AddBoardBtnProps) {
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");
  const { isBoardModalOpen, setIsBoardModalOpen } = useBoardStore();
  const { createBoard, isCreating } = useBoard(workspaceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!boardName.trim()) {
      return;
    }

    try {
      await createBoard({
        name: boardName.trim(),
        workspaceId,
        description: boardDescription.trim() || null,
      });

      setBoardName("");
      setBoardDescription("");
      setIsBoardModalOpen(false);
    } catch (error) {
      console.error("Failed to create board:", error);
      // You can add toast notification here
    }
  };

  return (
    <Dialog open={isBoardModalOpen} onOpenChange={setIsBoardModalOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" type="button">
          <Plus />
          Add Board
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>
          <DialogDescription>
            Create a new board. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Board Name</Label>
              <Input
                id="name"
                name="name"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="Enter board name..."
                disabled={isCreating}
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={boardDescription}
                onChange={(e) => setBoardDescription(e.target.value)}
                placeholder="Enter board description..."
                disabled={isCreating}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isCreating}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!boardName.trim() || isCreating}>
              {isCreating ? "Creating..." : "Create Board"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
