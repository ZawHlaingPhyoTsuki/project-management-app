import { useArchiveWorkspace } from "@/data/workspaces/mutations";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface UseArchiveWorkspaceConfirmationProps {
  workspaceName: string;
  onSuccess?: () => void;
}

export function useArchiveWorkspaceConfirmation({
  workspaceName,
  onSuccess,
}: UseArchiveWorkspaceConfirmationProps) {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const { mutateAsync: archiveWorkspace, isPending } = useArchiveWorkspace();
  const router = useRouter();

  const handleArchiveWorkspace = async (workspaceId: string) => {
    try {
      const result = await archiveWorkspace({ workspaceId });

      if (result.success) {
        toast.success("Workspace archived", {
          description: `${workspaceName} has been successfully archived. You can restore it from the archived section.`,
        });
        setShowArchiveDialog(false);

        // Redirect after successful archive
        router.push("/dashboard/workspaces");
        router.refresh(); // Refresh to get updated data

        onSuccess?.();
      } else {
        toast.error("Error", {
          description: result.error || "Failed to archive workspace",
        });
      }
    } catch (_error) {
      toast.error("An unexpected error occurred");
    }
  };

  return {
    showArchiveDialog,
    setShowArchiveDialog,
    handleArchiveWorkspace,
    isPending,
  };
}
