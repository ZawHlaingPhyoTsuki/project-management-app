"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateWorkspace } from "@/hooks/use-workspace";
import { useWorkspaceStore } from "@/store/use-workspace-store";
import {
  CreateWorkspaceSchema,
  type CreateWorkspaceType,
} from "@/validations/workspace";

export default function CreateWorkspaceDialog() {
  // const [open, setOpen] = useState(false);
  const { mutateAsync: createWorkspace, isPending } = useCreateWorkspace();
  const { isWorkspaceModalOpen, setIsWorkspaceModalOpen } =
    useWorkspaceStore();

  const form = useForm<CreateWorkspaceType>({
    resolver: zodResolver(CreateWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    // setOpen(isOpen);
    setIsWorkspaceModalOpen(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  const onSubmit = async (data: CreateWorkspaceType) => {
    try {
      const result = await createWorkspace({
        name: data.name.trim(),
        description: data.description?.trim() || null,
      });

      if (result.success) {
        toast.success("Workspace created successfully");
        handleOpenChange(false);
        form.reset();
      } else {
        toast.error(result.error || "Failed to create workspace");
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={isWorkspaceModalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Add Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Workspace</DialogTitle>
            <DialogDescription>
              Create a new workspace to organize your boards and collaborate
              with your team.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="workspace-name">Workspace Name</FieldLabel>
                <Input
                  id="workspace-name"
                  placeholder="e.g., Marketing Team"
                  {...form.register("name")}
                  autoFocus
                />
                {form.formState.errors.name && (
                  <FieldError errors={[form.formState.errors.name]} />
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="workspace-description">
                  Description{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Textarea
                  id="workspace-description"
                  placeholder="Describe what this workspace is for..."
                  rows={3}
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <FieldError errors={[form.formState.errors.description]} />
                )}
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !form.formState.isDirty}
            >
              {isPending ? "Creating..." : "Create Workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
