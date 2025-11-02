// "use client";

// import { useState } from "react";
// import { UserPlus, Mail, Link } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { InviteByEmailForm } from "./invite-by-email-form";
// import { CreateShareableLink } from "./create-shareable-link";

// interface Workspace {
//   id: string;
//   name: string;
// }

// interface InviteMembersCardProps {
//   workspace: Workspace;
// }

// export function InviteMembersCard({ workspace }: InviteMembersCardProps) {
//   const [open, setOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("email");

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Invite Members</CardTitle>
//         <CardDescription>
//           Add new members to your workspace via email or shareable link
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogTrigger asChild>
//             <Button className="w-full">
//               <UserPlus className="h-4 w-4 mr-2" />
//               Invite Members
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[500px]">
//             <DialogHeader>
//               <DialogTitle>Invite to {workspace.name}</DialogTitle>
//               <DialogDescription>
//                 Choose how you want to invite members to this workspace.
//               </DialogDescription>
//             </DialogHeader>

//             <Tabs
//               value={activeTab}
//               onValueChange={setActiveTab}
//               className="mt-4"
//             >
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="email">
//                   <Mail className="h-4 w-4 mr-2" />
//                   Email Invite
//                 </TabsTrigger>
//                 <TabsTrigger value="link">
//                   <Link className="h-4 w-4 mr-2" />
//                   Shareable Link
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="email" className="space-y-4">
//                 <InviteByEmailForm
//                   workspaceId={workspace.id}
//                   onSuccess={() => setOpen(false)}
//                 />
//               </TabsContent>

//               <TabsContent value="link" className="space-y-4">
//                 <CreateShareableLink
//                   workspaceId={workspace.id}
//                   onSuccess={() => setOpen(false)}
//                 />
//               </TabsContent>
//             </Tabs>
//           </DialogContent>
//         </Dialog>
//       </CardContent>
//     </Card>
//   );
// }
