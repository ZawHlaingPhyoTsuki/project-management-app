"use client";

import { Archive, Ellipsis, Plus, List, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TaskListEllipsisDropdown() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button size="icon-sm" aria-label="Open menu" variant="ghost">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>List Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Add Card
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center cursor-pointer">
          <Archive className="h-4 w-4 mr-2" />
          Archive List
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center cursor-pointer ">
          <List className="h-4 w-4 mr-2" />
          Archive All Cards
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center cursor-pointer text-destructive focus:text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete List
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
