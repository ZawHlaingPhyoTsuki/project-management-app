// "use client";

// import { Copy, MoreVertical, Trash2 } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// interface Invitation {
//   id: string;
//   email: string;
//   role: "ADMIN" | "MEMBER" | "VIEWER";
//   status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
//   expiresAt: string;
//   invitedBy: {
//     name: string;
//   };
//   token: string;
// }

// interface PendingInvitationsProps {
//   workspaceId: string;
// }

// export function PendingInvitations({ workspaceId }: PendingInvitationsProps) {
//   // TODO: Fetch actual invitations
//   const invitations: Invitation[] = [
//     {
//       id: "1",
//       email: "alice@example.com",
//       role: "MEMBER",
//       status: "PENDING",
//       expiresAt: "2024-12-31T23:59:59Z",
//       invitedBy: { name: "John Doe" },
//       token: "invite-token-123",
//     },
//   ];

//   const getStatusVariant = (status: string) => {
//     switch (status) {
//       case "PENDING":
//         return "secondary";
//       case "ACCEPTED":
//         return "default";
//       case "DECLINED":
//         return "destructive";
//       case "EXPIRED":
//         return "outline";
//       default:
//         return "outline";
//     }
//   };

//   const handleCopyInviteLink = (token: string) => {
//     const inviteLink = `${window.location.origin}/join/${token}`;
//     navigator.clipboard.writeText(inviteLink);
//     // TODO: Show toast
//   };

//   const handleCancelInvitation = (invitationId: string) => {
//     // TODO: Implement cancel invitation logic
//     console.log(`Cancel invitation ${invitationId}`);
//   };

//   const pendingInvitations = invitations.filter(
//     (inv) => inv.status === "PENDING"
//   );

//   if (pendingInvitations.length === 0) {
//     return null;
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Pending Invitations</CardTitle>
//         <CardDescription>
//           Invitations that haven&apos;t been accepted yet
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {pendingInvitations.map((invitation) => (
//             <div
//               key={invitation.id}
//               className="flex items-center justify-between p-3 border rounded-lg"
//             >
//               <div className="flex items-center gap-4 flex-1 min-w-0">
//                 <div className="flex-1 min-w-0">
//                   <div className="font-medium truncate">{invitation.email}</div>
//                   <div className="text-sm text-muted-foreground">
//                     Invited by {invitation.invitedBy.name} • Expires{" "}
//                     {new Date(invitation.expiresAt).toLocaleDateString()}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Badge variant={getStatusVariant(invitation.status)}>
//                     {invitation.status.toLowerCase()}
//                   </Badge>
//                   <Badge variant="outline">
//                     {invitation.role.toLowerCase()}
//                   </Badge>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handleCopyInviteLink(invitation.token)}
//                 >
//                   <Copy className="h-4 w-4 mr-2" />
//                   Copy Link
//                 </Button>

//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="icon">
//                       <MoreVertical className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent>
//                     <DropdownMenuItem
//                       className="text-destructive"
//                       onClick={() => handleCancelInvitation(invitation.id)}
//                     >
//                       <Trash2 className="h-4 w-4 mr-2" />
//                       Cancel Invitation
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
