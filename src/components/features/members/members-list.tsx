// "use client";

// import { MoreVertical, Trash2, Crown, Shield, User, Eye } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface Member {
//   id: string;
//   user: {
//     id: string;
//     name: string;
//     email: string;
//     image?: string;
//   };
//   role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
//   joinedAt: string;
// }

// interface MembersListProps {
//   members: Member[];
//   workspace: {
//     id: string;
//     name: string;
//   };
//   currentUserId: string;
// }

// export function MembersList({
//   members,
//   workspace,
//   currentUserId,
// }: MembersListProps) {
//   const getRoleIcon = (role: string) => {
//     switch (role) {
//       case "OWNER":
//         return <Crown className="h-4 w-4" />;
//       case "ADMIN":
//         return <Shield className="h-4 w-4" />;
//       case "MEMBER":
//         return <User className="h-4 w-4" />;
//       case "VIEWER":
//         return <Eye className="h-4 w-4" />;
//       default:
//         return <User className="h-4 w-4" />;
//     }
//   };

//   const getRoleBadgeVariant = (role: string) => {
//     switch (role) {
//       case "OWNER":
//         return "default";
//       case "ADMIN":
//         return "secondary";
//       case "MEMBER":
//         return "outline";
//       case "VIEWER":
//         return "outline";
//       default:
//         return "outline";
//     }
//   };

//   const handleRoleChange = async (memberId: string, newRole: string) => {
//     // TODO: Implement role change logic
//     console.log(`Change role for ${memberId} to ${newRole}`);
//   };

//   const handleRemoveMember = async (memberId: string) => {
//     // TODO: Implement remove member logic
//     console.log(`Remove member ${memberId}`);
//   };

//   const isCurrentUser = (member: Member) => member.user.id === currentUserId;
//   const canModifyMember = (member: Member) => {
//     if (isCurrentUser(member)) return false;
//     if (member.role === "OWNER") return false;
//     return true;
//   };

//   const sortedMembers = [...members].sort((a, b) => {
//     const roleOrder = { OWNER: 0, ADMIN: 1, MEMBER: 2, VIEWER: 3 };
//     return roleOrder[a.role] - roleOrder[b.role];
//   });

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Workspace Members</CardTitle>
//         <CardDescription>
//           {members.length} member{members.length !== 1 ? "s" : ""} in this
//           workspace
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {sortedMembers.map((member) => (
//             <div
//               key={member.id}
//               className="flex items-center justify-between p-3 border rounded-lg"
//             >
//               <div className="flex items-center gap-3 flex-1 min-w-0">
//                 <Avatar>
//                   <AvatarImage src={member.user.image} />
//                   <AvatarFallback>
//                     {member.user.name
//                       .split(" ")
//                       .map((n) => n[0])
//                       .join("")}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2">
//                     <div className="font-medium truncate">
//                       {member.user.name}
//                     </div>
//                     {isCurrentUser(member) && (
//                       <Badge variant="outline" className="text-xs">
//                         You
//                       </Badge>
//                     )}
//                   </div>
//                   <div className="text-sm text-muted-foreground truncate">
//                     {member.user.email}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Badge
//                   variant={getRoleBadgeVariant(member.role)}
//                   className="flex items-center gap-1"
//                 >
//                   {getRoleIcon(member.role)}
//                   {member.role.toLowerCase()}
//                 </Badge>

//                 <Select
//                   value={member.role}
//                   onValueChange={(value) => handleRoleChange(member.id, value)}
//                   disabled={!canModifyMember(member)}
//                 >
//                   <SelectTrigger className="w-32">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="ADMIN">Admin</SelectItem>
//                     <SelectItem value="MEMBER">Member</SelectItem>
//                     <SelectItem value="VIEWER">Viewer</SelectItem>
//                   </SelectContent>
//                 </Select>

//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       disabled={!canModifyMember(member)}
//                     >
//                       <MoreVertical className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem
//                       className="text-destructive"
//                       onClick={() => handleRemoveMember(member.id)}
//                     >
//                       <Trash2 className="h-4 w-4 mr-2" />
//                       Remove Member
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
