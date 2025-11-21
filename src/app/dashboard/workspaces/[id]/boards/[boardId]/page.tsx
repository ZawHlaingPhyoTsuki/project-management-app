import { auth } from "@/lib/auth";
import BoardView from "@/components/features/board/board-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ShareLinkHeader from "@/components/layout/share-link-header";

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

  return (
    <>
      <ShareLinkHeader boardId={boardId} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col">
          {/* Kanban Board Container */}
          <div className="custom-scrollbar-horizontal flex-1 overflow-x-auto px-4 py-4">
            <BoardView
              boardId={boardId}
              workspaceId={id}
              // initialData={data.data}
            />
          </div>
        </div>
      </div>
    </>
  );
}
