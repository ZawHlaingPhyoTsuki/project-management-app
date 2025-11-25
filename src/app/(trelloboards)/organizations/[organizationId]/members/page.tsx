import AllMembers from "@/components/AllMembers";
import { OrgId } from "@/interfaces";
import prisma from "@/lib/db";

export default async function Page({ params }: OrgId) {
  const { organizationId } = await params;
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: { users: true },
  });
  return (
    <div className="w-full">
      <AllMembers organization={organization} />
    </div>
  );
};

