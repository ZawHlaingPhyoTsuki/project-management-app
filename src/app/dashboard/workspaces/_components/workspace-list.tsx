"use client";

import { useWorkspace } from "@/hooks/use-workspace";
import WorkspaceCard from "./workspace-card";
import WorkspaceEmpty from "./workspace-empty";

export default function WorkspaceList() {
  const { workspaces, isLoading } = useWorkspace();

  if (isLoading) {
    return (
      <div className="p-4 text-muted-foreground">Loading workspaces...</div>
    );
  }

  if (!workspaces || workspaces.length === 0) {
    return <WorkspaceEmpty />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {workspaces.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
}
