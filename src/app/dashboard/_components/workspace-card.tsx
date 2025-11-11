"use client";

import { Calendar, Layout, MoreHorizontal, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspaceActions } from "@/hooks/workspaces/use-workspace-actions";

interface WorkspaceCardProps {
  workspace: {
    id: string;
    name: string;
    description?: string | null;
    createdAt: Date;
    _count: {
      members: number;
      boards: number;
    };
    members: Array<{
      user: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
      };
    }>;
  };
}

export default function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const router = useRouter();

  const { delete: deleteAction } = useWorkspaceActions();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="group relative rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              <Link
                href={`/dashboard/workspaces/${workspace.id}/boards`}
                className="hover:text-primary transition-colors"
              >
                {workspace.name}
              </Link>
            </h3>
            {workspace.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {workspace.description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/workspaces/${workspace.id}/settings`)
                }
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteAction.setIsOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{workspace._count.members} members</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Layout className="h-4 w-4" />
            <span>{workspace._count.boards} boards</span>
          </div>
        </div>

        {/* Members Avatars */}
        {workspace.members.length > 0 && (
          <div className="flex items-center mb-4">
            <div className="flex -space-x-2">
              {workspace.members.slice(0, 3).map((member, index) => (
                <div key={member.user.id} className="relative">
                  {member.user.image ? (
                    <Image
                      src={member.user.image}
                      alt={member.user.name || "Member"}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full border-2 border-background bg-muted object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {member.user.name?.[0]?.toUpperCase() ||
                          member.user.email[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  {index === 2 && workspace.members.length > 3 && (
                    <div className="absolute inset-0 h-8 w-8 rounded-full border-2 border-background bg-muted/80 flex items-center justify-center">
                      <span className="text-xs font-medium">
                        +{workspace.members.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Created {formatDate(workspace.createdAt)}</span>
          </div>

          <Badge variant="secondary" className="text-xs">
            Workspace
          </Badge>
        </div>

        {/* Hover Action */}
        <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteAction.isOpen}
        onOpenChange={deleteAction.setIsOpen}
        onConfirm={() => deleteAction.execute({ workspaceId: workspace.id })}
        title="Are you sure?"
        description={`This action cannot be undone. This will permanently delete the workspace "${workspace.name}" and all of its boards and data.`}
        confirmText="Delete Workspace"
        requireConfirmation={true}
        expectedText={workspace.name}
        isPending={deleteAction.isPending}
      />
    </>
  );
}
