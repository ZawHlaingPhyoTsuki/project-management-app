// "use client";

// import { useState } from "react";
// import { Plus, X } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { useSendInvitations } from "@/hooks/use-invitations";
// import {
//   SendInvitationSchema,
//   type SendInvitationType,
// } from "@/validations/invitation";

// interface InviteByEmailFormProps {
//   workspaceId: string;
//   onSuccess: () => void;
// }

// interface EmailWithRole {
//   email: string;
//   role: "MEMBER" | "ADMIN" | "VIEWER";
// }

// export function InviteByEmailForm({
//   workspaceId,
//   onSuccess,
// }: InviteByEmailFormProps) {
//   const [emails, setEmails] = useState<EmailWithRole[]>([]);
//   const [currentEmail, setCurrentEmail] = useState("");
//   const [currentRole, setCurrentRole] = useState<"MEMBER" | "ADMIN" | "VIEWER">(
//     "MEMBER"
//   );
//   const { mutateAsync: sendInvitations, isPending } = useSendInvitations();

//   const addEmail = () => {
//     if (!currentEmail.trim()) return;

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(currentEmail)) {
//       toast.error("Please enter a valid email address");
//       return;
//     }

//     if (emails.some((e) => e.email === currentEmail)) {
//       toast.error("This email has already been added");
//       return;
//     }

//     setEmails([...emails, { email: currentEmail, role: currentRole }]);
//     setCurrentEmail("");
//   };

//   const removeEmail = (emailToRemove: string) => {
//     setEmails(emails.filter((e) => e.email !== emailToRemove));
//   };

//   const updateRole = (
//     email: string,
//     newRole: "MEMBER" | "ADMIN" | "VIEWER"
//   ) => {
//     setEmails(
//       emails.map((e) => (e.email === email ? { ...e, role: newRole } : e))
//     );
//   };

//   const handleSubmit = async () => {
//     if (emails.length === 0) {
//       toast.error("Please add at least one email address");
//       return;
//     }

//     try {
//       const result = await sendInvitations({
//         workspaceId,
//         invitations: emails,
//       });

//       if (result.success) {
//         toast.success(
//           `Invitations sent to ${emails.length} member${emails.length !== 1 ? "s" : ""}`
//         );
//         setEmails([]);
//         onSuccess();
//       } else {
//         toast.error(result.error || "Failed to send invitations");
//       }
//     } catch (error) {
//       console.error("Error sending invitations:", error);
//       toast.error("Something went wrong");
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       addEmail();
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="space-y-3">
//         <div className="flex gap-2">
//           <Input
//             placeholder="Enter email address"
//             value={currentEmail}
//             onChange={(e) => setCurrentEmail(e.target.value)}
//             onKeyPress={handleKeyPress}
//             disabled={isPending}
//           />
//           <Select
//             value={currentRole}
//             onValueChange={(value: "MEMBER" | "ADMIN" | "VIEWER") =>
//               setCurrentRole(value)
//             }
//           >
//             <SelectTrigger className="w-28">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="MEMBER">Member</SelectItem>
//               <SelectItem value="ADMIN">Admin</SelectItem>
//               <SelectItem value="VIEWER">Viewer</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button type="button" onClick={addEmail} disabled={isPending}>
//             <Plus className="h-4 w-4" />
//           </Button>
//         </div>

//         {emails.length > 0 && (
//           <div className="space-y-2">
//             <div className="text-sm font-medium">To be invited:</div>
//             <div className="flex flex-wrap gap-2">
//               {emails.map(({ email, role }) => (
//                 <Badge key={email} variant="secondary" className="px-3 py-1">
//                   {email}
//                   <span className="ml-2 text-muted-foreground">
//                     ({role.toLowerCase()})
//                   </span>
//                   <button
//                     type="button"
//                     onClick={() => removeEmail(email)}
//                     className="ml-1 hover:text-destructive"
//                   >
//                     <X className="h-3 w-3" />
//                   </button>
//                 </Badge>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       <Button
//         onClick={handleSubmit}
//         disabled={emails.length === 0 || isPending}
//         className="w-full"
//       >
//         {isPending
//           ? "Sending..."
//           : `Send ${emails.length} Invitation${emails.length !== 1 ? "s" : ""}`}
//       </Button>
//     </div>
//   );
// }
