"use client";

import { MoreHorizontal, Settings, Users, Archive } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { can } from "@/lib/permissions";
// import { toast } from "sonner";
import { Action, Resource } from "@/types/permission";
import { useArchiveBoardConfirmation } from "@/hooks/use-archive-board-confirmation";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";

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
  const {
    showArchiveDialog,
    setShowArchiveDialog,
    handleArchiveBoard,
    isPending: isArchivePending,
  } = useArchiveBoardConfirmation({ boardName: board.name });

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

  const handleManageMembers = (boardId: string) => {
    // TODO: Navigate to board members management
    console.log("Manage members for board:", boardId);
  };

  return (
    <Card key={board.id} className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-base truncate">
              <Link
                href={`/dashboard/workspaces/${workspace.id}/boards/${board.id}`}
                className="hover:underline"
              >
                {board.name} - {board.isArchived ? "Archived" : "Active"}
              </Link>
            </CardTitle>
            {board.description && (
              <CardDescription className="line-clamp-2 text-xs">
                {board.description}
              </CardDescription>
            )}
          </div>
          {canUserManageBoard(board) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/boards/${board.id}/settings`}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleManageMembers(board.id)}>
                  <Users className="h-4 w-4 mr-2" />
                  Members
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowArchiveDialog(true)}
                  className="text-destructive"
                  disabled={isArchivePending}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  {isArchivePending ? "Archiving..." : "Archive"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        open={showArchiveDialog}
        onOpenChange={setShowArchiveDialog}
        onConfirm={() => handleArchiveBoard(board.id, workspace.id)}
        title="Archive Board"
        description={`This action will archive "${board.name}". All data will be preserved but moved to trash. You can restore it later if needed.`}
        confirmText="Archive Board"
        isPending={isArchivePending}
      />
    </Card>
  );
}
