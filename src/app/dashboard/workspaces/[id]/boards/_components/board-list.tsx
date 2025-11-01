"use client";

import { Spinner } from "@/components/ui/spinner";
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
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Spinner className="h-8 w-8 mx-auto" />
          <p className="text-muted-foreground">Loading boards...</p>
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
