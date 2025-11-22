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
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleManageMembers = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    // TODO: Navigate to board members management
    console.log("Manage members for board:", boardId);
    // implement navigation logic here
    // router.push(`/boards/${boardId}/members`);
  };

  // const handleSettings = (e: React.MouseEvent) => {
  //   e.stopPropagation(); // Prevent event bubbling
  //   // TODO: Navigate to board settings
  //   console.log("Settings for board:", boardId);
  //   // implement navigation logic here
  //   // router.push(`/boards/${boardId}/settings`);
  // };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowArchiveDialog();
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling for Link clicks
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 transition-opacity"
          onClick={(e) => e.stopPropagation()} // Prevent card click when dropdown trigger is clicked
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        {/* Stop propagation for menu content */}
        {/* <DropdownMenuItem asChild>
          <Link
            href={`/boards/${boardId}/settings`}
            className="flex items-center cursor-pointer"
            onClick={handleLinkClick}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem> */}
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
          onClick={handleArchive}
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
