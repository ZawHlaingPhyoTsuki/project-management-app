import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/add-header";
import { auth } from "@/lib/auth";
import AddBoardBtn from "./_components/add-board-btn";
import BoardList from "./_components/board-list";

export default async function WorkspaceDetailPage({
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

  return (
    <>
      <Header>
        <AddBoardBtn workspaceId={id} />
      </Header>

      <div className="flex flex-1 flex-col p-6">
        <div className="@container/main flex flex-1 flex-col">
          <BoardList workspaceId={id} />
        </div>
      </div>
    </>
  );
}
