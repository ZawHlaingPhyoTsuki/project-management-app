import ListContainer from "@/components/ListContainer";
import prisma from "@/lib/db";

const BoardPage = async ({ params }: { params: Promise<{ boardId: string }> }) => {
  const { boardId } = await params;
  const list = await prisma.list.findMany({
    where: { boardId: boardId },
    include: {
      cards: {
        orderBy: {
          order: "asc",
        },
        include: {
          users: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });
  return (
    <div className="p-4 w-full overflow-x-auto">
      <ListContainer boardId={boardId} list={list} />
    </div>
  );
};

export default BoardPage;
