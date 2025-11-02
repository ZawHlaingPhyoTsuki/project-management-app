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
import { Badge } from "@/components/ui/badge";
import { useArchiveBoard } from "@/hooks/use-board";
import { can } from "@/lib/permissions";
// import { toast } from "sonner";
import { Action, Resource } from "@/types/permission";
import { useSession } from "@/lib/auth-client";
import EmptySection from "@/components/empty-section";
import { useBoardStore } from "@/store/use-board-store";

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

interface BoardGridProps {
  boards: Board[];
  _workspace: {
    id: string;
    name: string;
  };
}

export function BoardGrid({ boards, _workspace }: BoardGridProps) {
  const { mutateAsync: archiveBoard, isPending: isArchiving } =
    useArchiveBoard();
  const { setIsBoardModalOpen } = useBoardStore();
  //   const { user } = useCurrentUser();
  const session = useSession();
  const user = session.data?.user;

  const handleArchiveBoard = async (boardId: string) => {
    // if (!user?.role || !can(user.role, Resource.BOARD, Action.ARCHIVE)) {
    //   toast.error("You don't have permission to archive boards");
    //   return;
    // }

    try {
      await archiveBoard(boardId);
    } catch (error) {
      console.error("Error archiving board:", error);
    }
  };

  const handleManageMembers = (boardId: string) => {
    // TODO: Navigate to board members management
    console.log("Manage members for board:", boardId);
  };

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

  if (boards.length === 0) {
    return (
      <EmptySection
        title="No boards yet"
        description="Create your firstt board to start organizing tasks"
        showButton={true}
        buttonText="Create board"
        onClick={() => setIsBoardModalOpen(true)}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Active Boards</h2>
        <Badge variant="secondary">{boards.length} boards</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {boards.map((board) => (
          <Card
            key={board.id}
            className="group hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 min-w-0">
                  <CardTitle className="text-base truncate">
                    <Link
                      href={`/boards/${board.id}`}
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
                      <DropdownMenuItem
                        onClick={() => handleManageMembers(board.id)}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Members
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleArchiveBoard(board.id)}
                        className="text-destructive"
                        disabled={isArchiving}
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        {isArchiving ? "Archiving..." : "Archive"}
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
          </Card>
        ))}
      </div>
    </div>
  );
}
