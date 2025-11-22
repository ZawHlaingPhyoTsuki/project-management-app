"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllBoardsByUserId } from "@/data/boards/queries";
import { AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BoardListProps {
  userId: string;
}

/**
 * Render a responsive grid of boards for the specified user and handle loading, empty, and error states.
 *
 * @param userId - The user ID whose boards will be fetched and displayed
 * @returns A React element containing either: an error alert if the fetch failed, a skeleton grid while loading, an empty-state panel if there are no boards, or a responsive grid of board cards linking to each board
 */
export default function BoardList({ userId }: BoardListProps) {
  const { data, isLoading, error, isError } = useAllBoardsByUserId(
    userId as string
   
  );

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
      <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed bg-muted/50 p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">No boards created</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            You don&apos;t have any boards yet. Start creating content.
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Board
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {boards.map((board) => (
        <Link
          key={board.id}
          href={`/board/${board.id}`}
          className="group relative flex h-32 flex-col justify-between overflow-hidden rounded-md border bg-card p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <div className="font-semibold line-clamp-2">{board.name}</div>
          <div className="flex flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              {board.workspace.name}
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>{board._count?.taskLists || 0} lists</span>
              <span>{board._count?.members || 0} members</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}