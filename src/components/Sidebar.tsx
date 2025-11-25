import CreateOrgForm from "./CreateOrgForm";
import OrgList from "./OrgList";
import prisma from "@/lib/db";

const Sidebar = async () => {
  const getOrganizations = await prisma.organization.findMany();
  
  return (
    <div>
      <CreateOrgForm />
      <OrgList getOrganizations={getOrganizations} />
    </div>
  );
};

export default Sidebar;
