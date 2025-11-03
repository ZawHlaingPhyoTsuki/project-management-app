"use client";

import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import EmptySection from "@/components/empty-section";
import { useBoardStore } from "@/store/use-board-store";
import { BoardCard } from "./board-card";

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
  workspace: {
    id: string;
    name: string;
  };
}

export function BoardGrid({ boards, workspace }: BoardGridProps) {
  const { setIsBoardModalOpen } = useBoardStore();
  //   const { user } = useCurrentUser();
  const session = useSession();
  const user = session.data?.user;

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
          <BoardCard key={board.id} board={board} user={user} workspace={workspace} />
        ))}
      </div>
    </div>
  );
}

