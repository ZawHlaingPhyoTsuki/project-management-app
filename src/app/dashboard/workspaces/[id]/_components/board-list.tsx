"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useBoard } from "@/hooks/use-board";
import BoardCard from "./board-card";
import BoardEmpty from "./board-empty";

interface BoardListProps {
  workspaceId: string;
}

export default function BoardList({ workspaceId }: BoardListProps) {
  const { boards, isLoading, error } = useBoard(workspaceId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map(() => (
            <Skeleton key={crypto.randomUUID()} className="h-40 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive">
          Error loading boards: {error.message}
        </div>
      </div>
    );
  }

  if (!boards || boards.length === 0) {
    return <BoardEmpty />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Boards</h1>
          <p className="text-muted-foreground mt-1">
            {boards.length} {boards.length === 1 ? "board" : "boards"} in this
            workspace
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </div>
    </div>
  );
}
