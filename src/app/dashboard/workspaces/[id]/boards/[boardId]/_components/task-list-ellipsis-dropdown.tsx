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
import { useArchiveTasklistConfirmation } from "@/hooks/use-archive-tasklist-confirmation";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";

interface TaskListEllipsisDropdownProps {
  tasklistId: string;
  tasklistName: string;
  boardId: string;
}

export default function TaskListEllipsisDropdown({
  tasklistId,
  tasklistName,
  boardId,
}: TaskListEllipsisDropdownProps) {
  const {
    showArchiveDialog,
    setShowArchiveDialog,
    handleArchiveTasklist,
    isPending: isArchivePending,
  } = useArchiveTasklistConfirmation({ tasklistName });

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
            onClick={() => setShowArchiveDialog(true)}
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
          <DropdownMenuItem className="flex items-center cursor-pointer text-destructive focus:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationDialog
        open={showArchiveDialog}
        onOpenChange={setShowArchiveDialog}
        onConfirm={() => handleArchiveTasklist(tasklistId, boardId)}
        title="Archive Task List"
        description={`This action will archive "${tasklistName}". All data will be preserved but moved to trash. You can restore it later if needed.`}
        confirmText="Archive List"
        isPending={isArchivePending}
      />
    </>
  );
}
