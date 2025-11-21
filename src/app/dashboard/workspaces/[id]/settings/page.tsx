import { redirect } from "next/navigation";
import { getActiveWorkspaceById } from "@/actions/workspaces";
import DangerZone from "@/components/features/workspace/danger-zone";
import WorkspaceGeneralSettings from "@/components/features/workspace/workspace-general-settings";
import WorkspaceInvitations from "@/components/features/workspace/workspace-invitations";
import DashboardContentWrapper from "@/components/shared/dashboard-content-wrapper";

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    redirect("/dashboard");
  }

  const workspace = await getActiveWorkspaceById(id);

  if (!workspace.success || !workspace.data) {
    redirect("/dashboard");
  }

  return (
    <DashboardContentWrapper
      title="Workspace Settings"
      description="Manage your workspaces and collaborate with your team"
    >
      <WorkspaceGeneralSettings workspace={workspace.data} />
      <WorkspaceInvitations />
      <DangerZone workspace={workspace.data} />
    </DashboardContentWrapper>
  );
}
