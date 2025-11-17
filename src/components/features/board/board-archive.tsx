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
import { useWorkspaceArchivedBoards } from "@/data/boards/queries";

export function BoardArchive({ workspaceId }: { workspaceId: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: boards } = useWorkspaceArchivedBoards(workspaceId);

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
              <BoardArchiveCard key={board.id} board={board} />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
