"use client";

import { useWorkspace } from "@/hooks/use-workspace";
import WorkspaceCard from "./workspace-card";
import WorkspaceEmpty from "./workspace-empty";

export interface WorkspaceType {
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
}

interface WorkspaceListProps {
  initialData: WorkspaceType[];
}

export default function WorkspaceList({ initialData }: WorkspaceListProps) {
  const { workspaces, isLoading } = useWorkspace(initialData);

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
