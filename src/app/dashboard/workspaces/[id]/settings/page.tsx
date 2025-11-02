import { redirect } from "next/navigation";
import { getWorkspaceById } from "@/actions/workspaces";
import DangerZone from "./_components/danger-zone";
import WorkspaceGeneralSettings from "./_components/workspace-general-settings";
import WorkspaceInvitations from "./_components/workspace-invitations";
import WorkspaceMembers from "./_components/workspace-members";

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    redirect("/dashboard");
  }

  const workspace = await getWorkspaceById(id);

  // Handle case where workspace is null or not found
  if (!workspace.success || !workspace.data) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="@container/main flex flex-1 flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Workspace Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your workspaces and collaborate with your team
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <WorkspaceGeneralSettings workspace={workspace.data} />
          <WorkspaceMembers />
          <WorkspaceInvitations />
          <DangerZone workspace={workspace.data} />
        </div>
      </div>
    </div>
  );
}
