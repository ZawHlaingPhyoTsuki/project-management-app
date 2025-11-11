"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import BoardEllipsisDropdown from "./board-ellipsis-dropdown";
import { useBoardActions } from "@/hooks/boards/use-board-actions";

interface Board {
  id: string;
  name: string;
  description?: string | null;
  isArchived: boolean;
  archivedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    taskLists: number;
    members: number;
  };
  members?: Array<{
    role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
    userId: string;
  }>;
}

interface BoardCardProps {
  board: Board;
  workspace: {
    id: string;
    name: string;
  };
  user:
    | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      }
    | undefined;
}

export function BoardCard({ board, workspace, user }: BoardCardProps) {
  const { archive: archiveAction } = useBoardActions();

  // Check if user can perform actions on a specific board
  const canUserManageBoard = (board: Board) => {
    if (!user) return false;

    const userMember = board.members?.find(
      (member) => member.userId === user.id
    );
    if (!userMember) return false;

    return (
      can(userMember.role, Resource.BOARD, Action.UPDATE) ||
      can(userMember.role, Resource.BOARD, Action.ARCHIVE) ||
      can(userMember.role, Resource.BOARD, Action.INVITE)
    );
  };

  const canManageBoard = canUserManageBoard(board);

  return (
    <Card key={board.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-base truncate">
              <Link
                href={`/dashboard/workspaces/${workspace.id}/boards/${board.id}`}
                className="hover:underline"
              >
                {board.name}
              </Link>
            </CardTitle>
            {board.description && (
              <CardDescription className="line-clamp-2 text-xs">
                {board.description}
              </CardDescription>
            )}
          </div>
          {canManageBoard && (
            <BoardEllipsisDropdown
              boardId={board.id}
              setShowArchiveDialog={() => archiveAction.setIsOpen(true)}
              isArchivePending={archiveAction.isPending}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {board._count && (
              <>
                <span>{board._count.taskLists} lists</span>
                <span>{board._count.members} members</span>
              </>
            )}
          </div>
          <time dateTime={board.updatedAt.toString()}>
            {new Date(board.updatedAt).toLocaleDateString()}
          </time>
        </div>
      </CardContent>

      <DeleteConfirmationDialog
        open={archiveAction.isOpen}
        onOpenChange={archiveAction.setIsOpen}
        onConfirm={() =>
          archiveAction.execute({
            boardId: board.id,
            workspaceId: workspace.id,
          })
        }
        title="Archive Board"
        description={`This action will archive "${board.name}". All data will be preserved but moved to trash. You can restore it later if needed.`}
        confirmText="Archive Board"
        isPending={archiveAction.isPending}
        loadingText="Archiving..."
      />
    </Card>
  );
}
