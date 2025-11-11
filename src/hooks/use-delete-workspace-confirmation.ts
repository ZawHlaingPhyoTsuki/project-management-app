import { useDeleteWorkspace } from "@/data/workspaces/mutations";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface UseDeleteWorkspaceConfirmationProps {
  workspaceName: string;
  onSuccess?: () => void;
}

export function useDeleteWorkspaceConfirmation({
  workspaceName,
  onSuccess,
}: UseDeleteWorkspaceConfirmationProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutateAsync: deleteWorkspace, isPending } = useDeleteWorkspace();
  const router = useRouter();

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      const result = await deleteWorkspace({ workspaceId });

      if (result.success) {
        toast.success("Workspace deleted", {
          description: `${workspaceName} has been successfully deleted.`,
        });
        setShowDeleteDialog(false);

        // Redirect after successful archive
        router.push("/dashboard/workspaces");
        router.refresh(); // Refresh to get updated data

        onSuccess?.();
      } else {
        toast.error("Error", {
          description: result.error || "Failed to delete workspace",
        });
      }
    } catch (_error) {
      toast.error("An unexpected error occurred");
    }
  };

  return {
    showDeleteDialog,
    setShowDeleteDialog,
    handleDeleteWorkspace,
    isPending,
  };
}
