"use client";

import WorkspaceCard from "./workspace-card";
import EmptySection from "@/components/empty-section";
import { Layout } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace";
import { useWorkspaces } from "@/data/workspaces/queries";

export default function WorkspaceList() {
  const { data, isLoading } = useWorkspaces();
  const { setIsWorkspaceModalOpen } = useWorkspaceStore();

  const workspaces = data?.data;

  if (isLoading) {
    return (
      <div className="p-4 text-muted-foreground">Loading workspaces...</div>
    );
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <EmptySection
        title="No workspaces yet"
        description="Create your first workspace to get startted"
        icon={<Layout />}
        showButton
        buttonText="Create Workspace"
        onClick={() => setIsWorkspaceModalOpen(true)}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {workspaces.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
}
