"use client";

import { Archive, Trash2 } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useArchiveWorkspaceConfirmation } from "@/hooks/use-archive-workspace-confirmation";
import { useDeleteWorkspaceConfirmation } from "@/hooks/use-delete-workspace-confirmation";

interface DangerZoneProps {
  workspace: {
    id: string;
    name: string;
  };
}

export default function DangerZone({ workspace }: DangerZoneProps) {
  const {
    showArchiveDialog,
    setShowArchiveDialog,
    handleArchiveWorkspace,
    isPending: isArchivePending,
  } = useArchiveWorkspaceConfirmation({
    workspaceName: workspace.name,
  });

  const {
    showDeleteDialog,
    setShowDeleteDialog,
    handleDeleteWorkspace,
    isPending: isDeletePending,
  } = useDeleteWorkspaceConfirmation({
    workspaceName: workspace.name,
  });

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>Irreversible and destructive actions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Archive Workspace */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium">Archive Workspace</h4>
            <p className="text-sm text-muted-foreground">
              Archive this workspace. It will be moved to trash and can be
              restored later.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowArchiveDialog(true)}
            disabled={isArchivePending}
          >
            <Archive className="h-4 w-4 mr-2" />
            {isArchivePending ? "Archiving..." : "Archive"}
          </Button>
        </div>

        {/* Delete Workspace */}
        <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium text-destructive">Delete Workspace</h4>
            <p className="text-sm text-muted-foreground">
              Permanently delete this workspace and all of its data. This action
              cannot be undone.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeletePending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeletePending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardContent>

      {/* Archive Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showArchiveDialog}
        onOpenChange={setShowArchiveDialog}
        onConfirm={() => handleArchiveWorkspace(workspace.id)}
        title="Archive Workspace"
        description={`This action will archive "${workspace.name}". All boards and data will be preserved but moved to trash. You can restore it later if needed.`}
        confirmText="Archive Workspace"
        isPending={isArchivePending}
        loadingText="Archiving..."
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => handleDeleteWorkspace(workspace.id)}
        title="Are you absolutely sure?"
        description={`This action cannot be undone. This will permanently delete the workspace "${workspace.name}" and remove all data including boards, tasks, and member associations.`}
        confirmText="Delete Workspace"
        requireConfirmation={true}
        expectedText={workspace.name}
        isPending={isDeletePending}
      />
    </Card>
  );
}
