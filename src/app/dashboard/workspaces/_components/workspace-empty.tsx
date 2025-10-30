import { Layout, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkspaceEmptyProps {
  onAddWorkspace?: () => void;
}

export default function WorkspaceEmpty({
  onAddWorkspace,
}: WorkspaceEmptyProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
        <Layout className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No workspaces yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Create your first workspace to start organizing your projects and
        collaborating with your team.
      </p>
      {onAddWorkspace && (
        <Button onClick={onAddWorkspace}>
          <Plus className="h-4 w-4 mr-2" />
          Create Workspace
        </Button>
      )}
    </div>
  );
}
