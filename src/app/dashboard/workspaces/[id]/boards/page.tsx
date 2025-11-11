import { redirect } from "next/navigation";
import { getActiveWorkspaceById } from "@/actions/workspaces";
import { CreateBoardDialog } from "./_components/create-board-dialog";
import { BoardGrid } from "./_components/board-grid";
import { BoardArchive } from "./_components/board-archive";
import DashboardContentWrapper from "@/components/dashboard-content-wrapper";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function WorkspaceBoardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const [workspace] = await Promise.all([getActiveWorkspaceById(id)]);

  if (!workspace.success || !workspace.data) {
    redirect("/dashboard");
  }

  return (
    <DashboardContentWrapper
      title={`${workspace.data.name} - Boards`}
      description="Manage and organize your workspace boards"
      ActionButton={<CreateBoardDialog workspaceId={id} />}
    >
      {/* Active Boards */}
      <BoardGrid initialWorkspaceData={workspace.data} />

      {/* Archived Boards (collapsible) */}
      <BoardArchive workspaceId={id} />
    </DashboardContentWrapper>
  );
}
