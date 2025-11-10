"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Archive, Ellipsis } from "lucide-react";
import ArchivedTaskDialog from "./archived-task-dialog";

interface MenuDropdownProps {
  boardId: string;
}

export default function MenuDropdown({ boardId }: MenuDropdownProps) {
  const [showArchivedDialog, setShowArchivedDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[300px]"
          align="end"
          sideOffset={8}
          collisionPadding={16}
        >
          <DropdownMenuLabel>Board Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex gap-4 items-center cursor-pointer"
            onClick={() => setShowArchivedDialog(true)}
          >
            <Archive className="w-4 h-4" />
            Archived Items
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ArchivedTaskDialog
        open={showArchivedDialog}
        onOpenChange={setShowArchivedDialog}
        boardId={boardId}
      />
    </>
  );
}
