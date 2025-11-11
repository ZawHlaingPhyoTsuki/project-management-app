"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Archive, MoreHorizontal, Settings, Users } from "lucide-react";
import Link from "next/link";

interface BoardEllipsisDropdownProps {
  boardId: string;
  setShowArchiveDialog: () => void;
  isArchivePending: boolean;
}

export default function BoardEllipsisDropdown({
  boardId,
  setShowArchiveDialog,
  isArchivePending,
}: BoardEllipsisDropdownProps) {
  const handleManageMembers = () => {
    // TODO: Navigate to board members management
    console.log("Manage members for board:", boardId);
    // implement navigation logic here
    // router.push(`/boards/${boardId}/members`);
  };

  const handleSettings = () => {
    // TODO: Navigate to board settings
    console.log("Settings for board:", boardId);
    // implement navigation logic here
    // router.push(`/boards/${boardId}/settings`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 transition-opacity"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link
            href={`/boards/${boardId}/settings`}
            className="flex items-center cursor-pointer"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleManageMembers}
          className="flex items-center cursor-pointer"
        >
          <Users className="h-4 w-4 mr-2" />
          Members
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={setShowArchiveDialog}
          className="flex items-center cursor-pointer"
          disabled={isArchivePending}
        >
          <Archive className="h-4 w-4 mr-2" />
          {isArchivePending ? "Archiving..." : "Archive"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
