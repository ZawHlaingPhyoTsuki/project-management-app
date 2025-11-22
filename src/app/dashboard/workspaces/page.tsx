import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import CreateWorkspaceDialog from "@/components/features/workspace/create-workspace-dialog";
import WorkspaceList from "@/components/features/workspace/workspace-list";
import DashboardContentWrapper from "@/components/shared/dashboard-content-wrapper";

/**
 * Renders the Workspaces dashboard page and enforces authentication by redirecting unauthenticated users to "/sign-in".
 *
 * The page displays a header with the title and description, exposes a create-workspace action button, and renders the workspace list.
 *
 * @returns A React element for the Workspaces dashboard containing the title, description, create-workspace action, and the workspace list.
 */
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