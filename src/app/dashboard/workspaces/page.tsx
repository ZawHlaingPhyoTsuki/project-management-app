import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Header from "../../../components/add-header";
import AddWorkspaceBtn from "./_components/add-workspace-btn";
import WorkspaceList from "./_components/workspace-list";

export default async function WorkspacesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <>
      <Header>
        <AddWorkspaceBtn />
      </Header>

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

          <WorkspaceList />
        </div>
      </div>
    </>
  );
}
