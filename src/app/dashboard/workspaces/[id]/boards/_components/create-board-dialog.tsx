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
import { Textarea } from "@/components/ui/textarea";
import { useCreateBoard } from "@/hooks/use-board";
import { CreateBoardSchema, type CreateBoardType } from "@/validations/board";
// import { can } from "@/lib/permissions";
// import { Action, Resource } from "@/types/permission";
import { useBoardStore } from "@/store/use-board-store";
// import { can, Resource, Action } from "@/lib/permissions";

interface CreateBoardDialogProps {
  workspaceId: string;
}

export function CreateBoardDialog({ workspaceId }: CreateBoardDialogProps) {
  const { isBoardModalOpen, setIsBoardModalOpen } = useBoardStore();
  const { mutateAsync: createBoard, isPending } = useCreateBoard();
  //   const { user } = useCurrentUser();

  //   const canCreateBoard = user?.role
  //     ? can(user.role, Resource.BOARD, Action.CREATE)
  //     : false;

  const form = useForm<CreateBoardType>({
    resolver: zodResolver(CreateBoardSchema),
    defaultValues: {
      name: "",
      description: "",
      workspaceId,
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    setIsBoardModalOpen(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  const onSubmit = async (data: CreateBoardType) => {
    try {
      const result = await createBoard(data);

      if (result.success) {
        toast.success("Board created successfully");
        handleOpenChange(false);
        form.reset();
      } else {
        toast.error(result.error || "Failed to create board");
      }
    } catch (error) {
      console.error("Error creating board:", error);
      toast.error("Something went wrong");
    }
  };

  //   if (!canCreateBoard) {
  //     return null;
  //   }

  return (
    <Dialog open={isBoardModalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Create Board
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Board</DialogTitle>
            <DialogDescription>
              Add a new board to organize your tasks and collaborate with your
              team.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Board Name</FieldLabel>
                <Input
                  id="name"
                  placeholder="e.g., Product Roadmap"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <FieldError errors={[form.formState.errors.name]} />
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="description">
                  Description{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Textarea
                  id="description"
                  placeholder="Describe what this board is for..."
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
              {isPending ? "Creating..." : "Create Board"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
