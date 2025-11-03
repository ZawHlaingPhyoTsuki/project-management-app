import { redirect } from "next/navigation";
import { getWorkspaceById } from "@/actions/workspaces";
import { CreateBoardDialog } from "./_components/create-board-dialog";
import { BoardGrid } from "./_components/board-grid";
import { BoardArchive } from "./_components/board-archive";
import { getWorkspaceBoards } from "@/actions/boards/get-board";
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

  const [workspace, boards] = await Promise.all([
    getWorkspaceById(id),
    getWorkspaceBoards(id),
  ]);

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
      <BoardGrid
        boards={boards.data?.filter((b) => !b.isArchived) || []}
        workspace={workspace.data}
      />

      {/* Archived Boards (collapsible) */}
      <BoardArchive boards={boards.data?.filter((b) => b.isArchived) || []} />
    </DashboardContentWrapper>
  );
}
