import BoardList from "@/components/BoardList";
import OrgHeader from "@/components/OrgHeader";
import prisma from "@/lib/db";

interface OrgIdProps {
  params: Promise<{ organizationId: string }>;
}

export default async function Organization({ params }: OrgIdProps) {

  const { organizationId } = await params;

  if (!organizationId) {
    return <div>Organization not found</div>;
  }

  const getOrganization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
    include: {
      boards: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!getOrganization) {
    return <div>Organization not found</div>;
  }

  return (
    <div>
      <OrgHeader getOrganization={getOrganization} />
      <div>
        <BoardList getOrganization={getOrganization} />
      </div>
    </div>
  );
};
