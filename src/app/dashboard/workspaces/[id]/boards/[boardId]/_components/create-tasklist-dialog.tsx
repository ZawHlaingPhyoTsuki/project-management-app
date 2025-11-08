"use client";

import { Plus } from "lucide-react";
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
import { useCreateTaskList } from "@/hooks/use-task-list";
import { useTaskListStore } from "@/store/use-tasklist-store";
import { CreateTaskListSchema, CreateTaskListType } from "@/validations/task";

interface CreateTaskListDialogProps {
  boardId: string;
  workspaceId: string;
}

export default function CreateTaskListDialog({
  boardId,
  workspaceId,
}: CreateTaskListDialogProps) {
  const { mutateAsync: createTaskList, isPending } = useCreateTaskList();
  const { isTaskListModalOpen, setIsTaskListModalOpen } =
    useTaskListStore();

  const form = useForm<CreateTaskListType>({
    resolver: zodResolver(CreateTaskListSchema),
    defaultValues: { name: "" },
  });

  const handleOpenChange = (isOpen: boolean) => {
    setIsTaskListModalOpen(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  const onSubmit = async (data: CreateTaskListType) => {
    try {
      const trimmedName = data.name.trim();

      await createTaskList({
        name: trimmedName,
        boardId,
        workspaceId,
      });

      toast.success("Task list created successfully");
      handleOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error creating task list:", error);
      toast.error("Failed to create task list");
    }
  };

  return (
    <Dialog open={isTaskListModalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-80 text-lg">
          <Plus className="h-4 w-4" />
          Add another list
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add List</DialogTitle>
            <DialogDescription>
              Create a new list to organize your tasks within this board.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="list-name">List Name</FieldLabel>
                <Input
                  id="list-name"
                  placeholder="e.g., To Do"
                  {...form.register("name")}
                  autoFocus
                  disabled={isPending}
                />
                {form.formState.errors.name && (
                  <FieldError errors={[form.formState.errors.name]} />
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
              {isPending ? "Adding..." : "Add List"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
