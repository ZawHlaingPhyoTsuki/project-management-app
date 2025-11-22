"use client";

import { Badge } from "@/components/ui/badge";
import EmptySection from "@/components/shared/empty-section";
import { useBoardStore } from "@/stores/board";
import { BoardCard } from "./board-card";
import { useWorkspaceBoards } from "@/data/boards/queries";
import { Spinner } from "@/components/ui/spinner";
import { User } from "better-auth";

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
  initialBoardData?: Board[];
  initialWorkspaceData: {
    id: string;
    name: string;
  };
  user: User
}

export function BoardGrid({
  initialBoardData,
  initialWorkspaceData,
  user
}: BoardGridProps) {
  const { setIsBoardModalOpen } = useBoardStore();
  const { data, isLoading } = useWorkspaceBoards(
    initialWorkspaceData.id,
    initialBoardData
  );
  const boards = data?.data;

  if (isLoading || !boards) {
    return (
      <div className="flex w-full h-full min-h-[600px] items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (boards.length === 0) {
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
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Active Boards</h2>
        <Badge variant="secondary">{boards.length} boards</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {boards.map((board) => (
          <BoardCard
            key={board.id}
            board={board}
            user={user}
            workspace={initialWorkspaceData}
          />
        ))}
      </div>
    </div>
  );
}
