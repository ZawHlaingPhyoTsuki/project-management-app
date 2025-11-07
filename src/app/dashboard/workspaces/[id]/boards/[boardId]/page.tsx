import { auth } from "@/lib/auth";
import BoardView from "./_components/board-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTasklistByBoardIdAndWorkspaceId } from "@/actions/tasklist/get-tasklist";
import SecondHeader from "./_components/second-header";

interface Props {
  params: Promise<{
    id: string;
    boardId: string;
  }>;
}

export default async function BoardPage({ params }: Props) {
  const { id, boardId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const data = await getTasklistByBoardIdAndWorkspaceId(boardId, id);
  console.log({ data });

  if (!data.success) {
    return <div>Error loading tasklists</div>;
  }

  return (
    <>
      <SecondHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col">
          {/* Kanban Board Container */}
          <div className="custom-scrollbar-horizontal flex-1 overflow-x-auto px-4 py-4">
            <BoardView
              boardId={boardId}
              workspaceId={id}
              initialData={data.data}
            />
          </div>
        </div>
      </div>
    </>
  );
}
