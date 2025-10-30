import { headers } from "next/headers";
import { SiteHeader } from "@/components/sidebar/site-header";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import Header from "./_components/header";

export default async function WorkspacesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  // Use fetch directly in server component
  const workspaces = await prisma.workspace.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      },
      _count: {
        select: {
          boards: true,
          members: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  console.log({ workspaces });

  return (
    <>
      <SiteHeader />
      <Header />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col">
          <h1>Workspaces</h1>
        </div>
      </div>
    </>
  );
}
