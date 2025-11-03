"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRestoreBoard } from "@/hooks/use-board";
// import { useCurrentUser } from "@/hooks/use-current-user";
// import { can, Resource, Action } from "@/lib/permissions";
// import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { can } from "@/lib/permissions";
import { Action, Resource } from "@/types/permission";

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

interface BoardArchiveProps {
  boards: Board[];
}

export function BoardArchive({ boards }: BoardArchiveProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutateAsync: restoreBoard, isPending: isRestoring } =
    useRestoreBoard();
//   const { user } = useCurrentUser();
  const session = useSession();
  const user = session.data?.user;

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

  if (boards.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <div>
            <CardTitle className="text-lg">Archived Boards</CardTitle>
            <CardDescription>
              {boards.length} board{boards.length !== 1 ? "s" : ""} in archive
            </CardDescription>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {boards.map((board) => (
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
                {canUserRestoreBoard(board) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestoreBoard(board.id)}
                    disabled={isRestoring}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {isRestoring ? "Restoring..." : "Restore"}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
