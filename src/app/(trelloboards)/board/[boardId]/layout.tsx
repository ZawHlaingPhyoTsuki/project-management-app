import BoardNavbar from "@/components/BoardNavbar";
import prisma from "@/lib/db";
import React from "react";

const BoardLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ boardId: string }>;
}) => {
  const { boardId } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const board: any = await prisma.board.findUnique({
    where: { id: boardId },
    include: { users: true },
  });
  return (
    <div
      className="relative h-[85vh] bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${board?.image})` }}
    >
      <BoardNavbar board={board} />
      {/* <div className="absolute inset-0 bg-black/10" /> */}
      <div>{children}</div>
    </div>
  );
};

export default BoardLayout;
