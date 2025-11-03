// import { redirect } from "next/navigation";
// import { getWorkspaceById } from "@/actions/workspaces";
// import { getWorkspaceMembers } from "@/actions/workspace-members";
// import { InviteMembersCard } from "./_components/invite-members-card";
// import { MembersList } from "./_components/members-list";
// import { PendingInvitations } from "./_components/pending-invitations";
// import { MemberPermissions } from "./_components/member-permissions";

// export default async function WorkspaceMembersPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;

//   if (!id) {
//     redirect("/dashboard");
//   }

//   const [workspace, members] = await Promise.all([
//     getWorkspaceById(id),
//     getWorkspaceMembers(id),
//   ]);

//   if (!workspace.success || !workspace.data) {
//     redirect("/dashboard");
//   }

//   return (
//     <div className="flex flex-1 flex-col p-6">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold">
//             {workspace.data.name} - Members
//           </h1>
//           <p className="text-muted-foreground mt-1">
//             Manage workspace members and permissions
//           </p>
//         </div>
//       </div>

//       <div className="grid gap-6 @container/members">
//         {/* Invite Members */}
//         <InviteMembersCard workspace={workspace.data} />

//         {/* Current Members */}
//         <MembersList
//           members={members.data || []}
//           workspace={workspace.data}
//           currentUserId={/* pass current user id */}
//         />

//         {/* Pending Invitations */}
//         <PendingInvitations workspaceId={id} />

//         {/* Permissions Guide */}
//         <MemberPermissions />
//       </div>
//     </div>
//   );
// }

export default function WorkspaceMembersPage() {
  return <div>WorkspaceMembersPage</div>;
}
