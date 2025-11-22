"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BoardArchiveCard } from "./board-archive-card";
import { useArchivedWorkspaceBoards } from "@/data/boards/queries";
import { User } from "better-auth";

interface BoardArchiveProps {
  workspaceId: string;
  user: User;
}

export function BoardArchive({ workspaceId, user }: BoardArchiveProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data } = useArchivedWorkspaceBoards(workspaceId);
  const boards = data?.data;

  if (boards?.length === 0 || !boards) {
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
              <BoardArchiveCard
                key={board.id}
                board={board}
                workspaceId={workspaceId}
                user={user}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
