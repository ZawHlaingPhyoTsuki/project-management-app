"use client";

import { Archive, Ellipsis, Plus, List, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { useTaskListActions } from "@/hooks/task-lists/use-task-list-actions";

interface TaskListEllipsisDropdownProps {
  tasklistId: string;
  taskListName: string;
  boardId: string;
}

export default function TaskListEllipsisDropdown({
  tasklistId,
  taskListName,
  boardId,
}: TaskListEllipsisDropdownProps) {
  const { archive: archiveAction, delete: deleteAction } = useTaskListActions();

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button size="icon-sm" aria-label="Open menu" variant="ghost">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>List Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => archiveAction.setIsOpen(true)}
            className="flex items-center cursor-pointer"
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive List
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center cursor-pointer ">
            <List className="h-4 w-4 mr-2" />
            Archive All Cards
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => deleteAction.setIsOpen(true)}
            className="flex items-center cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Archive confirmation dialog */}
      <DeleteConfirmationDialog
        open={archiveAction.isOpen}
        onOpenChange={archiveAction.setIsOpen}
        onConfirm={() =>
          archiveAction.execute({ taskListId: tasklistId, boardId })
        }
        title="Archive Task List"
        description={`This action will archive "${taskListName}". All data will be preserved but moved to trash. You can restore it later if needed.`}
        confirmText="Archive List"
        isPending={archiveAction.isPending}
        loadingText="Archiving..."
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        open={deleteAction.isOpen}
        onOpenChange={deleteAction.setIsOpen}
        onConfirm={() =>
          deleteAction.execute({ taskListId: tasklistId, boardId })
        }
        title="Delete Task List"
        description={`This action will archive "${taskListName}". All data will be preserved but moved to trash. You can restore it later if needed.`}
        confirmText="Delete List"
        isPending={deleteAction.isPending}
        requireConfirmation
        expectedText={taskListName}
      />
    </>
  );
}
