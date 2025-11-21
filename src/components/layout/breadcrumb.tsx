"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useWorkspaceById } from "@/data/workspaces/queries";
import { useBoardById } from "@/data/boards/queries";

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // workspace handling
  const workspaceIndex = segments.indexOf("workspaces") + 1;
  const workspaceId =
    workspaceIndex > 0 && workspaceIndex < segments.length
      ? segments[workspaceIndex]
      : null;

  const { data: workspaceData, isLoading: isWorkspaceLoading } =
    useWorkspaceById(workspaceId!);

  const workspaceName = workspaceData?.data?.name;

  // board handling
  const boardIndex = segments.indexOf("boards") + 1;
  const boardId =
    boardIndex > 0 && boardIndex < segments.length
      ? segments[boardIndex]
      : null;

  const { data: boardData, isLoading: isBoardLoading } = useBoardById(boardId!);

  const boardName = boardData?.data?.name;

  // combined loading state
  const isLoading = isWorkspaceLoading || isBoardLoading;

  if (isLoading) {
    return (
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
        <div className="">/</div>
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
        <div className="">/</div>
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
      </nav>
    );
  }

  const buildHref = (i: number) => "/" + segments.slice(0, i + 1).join("/");

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      {segments.map((segment, i) => {
        const href = buildHref(i);
        let label = decodeURIComponent(segment);

        if (i === workspaceIndex && workspaceName) {
          label = workspaceName;
        }

        if (i === boardIndex && boardName) {
          label = boardName;
        }

        const isLast = i === segments.length - 1;

        return (
          <div key={href} className="flex items-center">
            {i !== 0 && <span className="mx-2">/</span>}

            {isLast ? (
              <span className="font-medium text-foreground capitalize">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-foreground transition-colors capitalize"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
