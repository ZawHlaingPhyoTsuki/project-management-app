import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import CreateWorkspaceDialog from "./_components/create-workspace-dialog";
import WorkspaceList from "./_components/workspace-list";
import DashboardContentWrapper from "@/components/dashboard-content-wrapper";

export default async function WorkspacesPage() {
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
