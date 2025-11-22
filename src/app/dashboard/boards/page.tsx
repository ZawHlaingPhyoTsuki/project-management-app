import BoardList from "@/components/features/board/board-list";
import { CreateBoardDialog } from "@/components/features/board/create-board-dialog";
import DashboardContentWrapper from "@/components/shared/dashboard-content-wrapper";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardBoardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <DashboardContentWrapper
      title="Boards"
      description="Manage your boards across all your workspaces."
      ActionButton={<CreateBoardDialog userId={session.user.id} />}
    >
      <BoardList user={session.user} />
    </DashboardContentWrapper>
  );
}
