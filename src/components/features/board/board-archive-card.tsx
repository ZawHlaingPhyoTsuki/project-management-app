"use client";

import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { useRestoreBoard } from "@/data/boards/mutations";
import { useBoardActions } from "@/hooks/boards/use-board-actions";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";
import { User } from "better-auth";
import { RefreshCw, Trash2 } from "lucide-react";

interface Board {
  id: string;
  name: string;
  description?: string | null;
  isArchived: boolean;
  archivedAt?: Date | null;
  createdAt: Date;
  members?: Array<{
    role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
    userId: string;
  }>;
}

export function BoardArchiveCard({
  board,
  workspaceId,
  user
}: {
  board: Board;
  workspaceId: string;
  user: User
}) {
  const { mutateAsync: restoreBoard, isPending: isRestoring } =
    useRestoreBoard(user.id);
  const { delete: deleteAction } = useBoardActions({
    workspaceId,
    userId: user.id,
  });

  const handleRestoreBoard = async (boardId: string) => {
    // if (!user?.role || !can(user.role, Resource.BOARD, Action.RESTORE)) {
    //   toast.error("You don't have permission to restore boards");
    //   return;
    // }

    try {
      await restoreBoard(boardId);
    } catch (error) {
      console.error("Error restoring board:", error);
    }
  };

  // Check if user can restore a specific board
  const canUserRestoreBoard = (board: Board) => {
    if (!user) return false;

    const userMember = board.members?.find(
      (member) => member.userId === user.id
    );
    if (!userMember) return false;

    return can(userMember.role, Resource.BOARD, Action.RESTORE);
  };

  return (
    <div
      key={board.id}
      className="flex items-center justify-between p-3 border rounded-lg"
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{board.name}</div>
        <div className="text-sm text-muted-foreground">
          Archived on{" "}
          {board.archivedAt
            ? new Date(board.archivedAt).toLocaleDateString()
            : "Unknown date"}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {canUserRestoreBoard(board) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRestoreBoard(board.id)}
            disabled={isRestoring}
          >
            <RefreshCw className="h-4 w-4" />
            {isRestoring ? "Restoring..." : "Restore"}
          </Button>
        )}
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteAction.setIsOpen(true)}
          disabled={deleteAction.isPending}
        >
          <Trash2 className="h-4 w-4" />
          {deleteAction.isPending ? "Deleting..." : "Delete"}
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteAction.isOpen}
        onOpenChange={deleteAction.setIsOpen}
        onConfirm={() => deleteAction.execute({ boardId: board.id })}
        title="Are you sure?"
        description={`This action cannot be undone. This will permanently delete the workspace "${board.name}" and all of its boards and data.`}
        confirmText="Delete Workspace"
        requireConfirmation={true}
        expectedText={board.name}
        isPending={deleteAction.isPending}
      />
    </div>
  );
}
