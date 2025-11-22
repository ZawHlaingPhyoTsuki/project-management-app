import { redirect } from "next/navigation";
import { getActiveWorkspaceById } from "@/actions/workspaces";
import { CreateBoardDialog } from "@/components/features/board/create-board-dialog";
import { BoardGrid } from "@/components/features/board/board-grid";
import { BoardArchive } from "@/components/features/board/board-archive";
import DashboardContentWrapper from "@/components/shared/dashboard-content-wrapper";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getWorkspaceBoards } from "@/actions/boards";

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

  const [workspace, boards] = await Promise.all([
    getActiveWorkspaceById(id),
    getWorkspaceBoards(id),
  ]);

  if (!workspace.success || !workspace.data) {
    redirect("/dashboard");
  }

  return (
    <DashboardContentWrapper
      title={`${workspace.data.name} - Boards`}
      description="Manage and organize your workspace boards"
      ActionButton={
        <CreateBoardDialog userId={session.user.id} workspaceId={id} />
      }
    >
      {/* Active Boards */}
      <BoardGrid
        initialWorkspaceData={workspace.data}
        initialBoardData={boards.data}
        user={session.user}
      />

      {/* Archived Boards (collapsible) */}
      <BoardArchive workspaceId={id} user={session.user} />
    </DashboardContentWrapper>
  );
}
