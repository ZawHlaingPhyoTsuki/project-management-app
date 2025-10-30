import { headers } from "next/headers";
import { getAllWorkspacesAction } from "@/actions/workspace-action";
import { SiteHeader } from "@/components/sidebar/site-header";
import { auth } from "@/lib/auth";
import Header from "./_components/header";
import WorkspaceList from "./_components/workspace-list";

export default async function WorkspacesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const result = await getAllWorkspacesAction(session.user.id);

  if (!result.success) {
    return (
      <>
        <SiteHeader />
        <Header />
        <div className="p-6">
          <div className="text-red-500">Error: {result.error}</div>
        </div>
      </>
    );
  }

  const workspaces = result.data ?? [];

  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col p-6">
        <div className="@container/main flex flex-1 flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Workspaces</h1>
              <p className="text-muted-foreground mt-1">
                Manage your workspaces and collaborate with your team
              </p>
            </div>
          </div>

          <WorkspaceList initialData={workspaces ?? []} />
        </div>
      </div>
    </>
  );
}
