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
import { useWorkspace } from "@/hooks/use-workspace";
import { useWorkspaceStore } from "@/store/use-workspace-store";

export default function AddWorkspaceBtn() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const { isWorkspaceModalOpen, setIsWorkspaceModalOpen } = useWorkspaceStore();
  const { createWorkspace, isCreating } = useWorkspace();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workspaceName.trim()) {
      return;
    }

    try {
      await createWorkspace({
        name: workspaceName.trim(),
        description: workspaceDescription.trim() || null,
      });

      setWorkspaceName("");
      setIsWorkspaceModalOpen(false);
    } catch (error) {
      console.error("Failed to create workspace:", error);
      // You can add toast notification here
    }
  };

  return (
    <Dialog open={isWorkspaceModalOpen} onOpenChange={setIsWorkspaceModalOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" type="button">
          <Plus />
          Add Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to organize your boards. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Workspace Name</Label>
              <Input
                id="name"
                name="name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Enter workspace name..."
                disabled={isCreating}
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={workspaceDescription}
                onChange={(e) => setWorkspaceDescription(e.target.value)}
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
            <Button
              type="submit"
              disabled={!workspaceName.trim() || isCreating}
            >
              {isCreating ? "Creating..." : "Create Workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
