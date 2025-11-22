"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useUserBoards } from "@/data/boards/queries";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EmptySection from "@/components/shared/empty-section";
import { useBoardStore } from "@/stores/board";
import { BoardCard } from "./board-card";
import { User } from "better-auth";

interface BoardListProps {
  user: User;
}

export default function BoardList({ user }: BoardListProps) {
  const { data, isLoading, error, isError } = useUserBoards(user.id);
  const { setIsBoardModalOpen } = useBoardStore();

  const boards = data?.data;

  // Error state
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "Failed to load boards. Please try again."}
        </AlertDescription>
      </Alert>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // Empty state
  if (!boards?.length) {
    return (
      <EmptySection
        title="No boards yet"
        description="Create your first board to start organizing tasks"
        showButton={true}
        buttonText="Create board"
        onClick={() => setIsBoardModalOpen(true)}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {boards.map((board) => (
        <BoardCard
          key={board.id}
          board={board}
          workspace={{ name: board.workspace.name, id: board.workspaceId }}
          user={user}
        />
      ))}
    </div>
  );
}
