import ActivityItem from "@/components/ActivityItem";
import { OrgId } from "@/interfaces";
import prisma from "@/lib/db";

const Activitypage = async ({ params }: OrgId) => {
  const { organizationId } = await params;
  const getAllActivities = await prisma.auditLog.findMany({
    where: { orgId: organizationId },
  });
  return (
    <>
      <ol className="mt-5">
        {getAllActivities?.map((item) => (
          <ActivityItem key={item.id} item={item} />
        ))}
      </ol>
    </>
  );
};

export default Activitypage;
