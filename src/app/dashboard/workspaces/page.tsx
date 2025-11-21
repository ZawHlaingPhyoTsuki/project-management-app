import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import CreateWorkspaceDialog from "@/components/features/workspace/create-workspace-dialog";
import WorkspaceList from "@/components/features/workspace/workspace-list";
import DashboardContentWrapper from "@/components/shared/dashboard-content-wrapper";

export default async function DasbhoardWorkspacePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }
  return (
    <DashboardContentWrapper
      title="Workspaces"
      description="Manage your workspaces and collaborate with your team"
      ActionButton={<CreateWorkspaceDialog />}
    >
      <WorkspaceList />
    </DashboardContentWrapper>
  );
}
