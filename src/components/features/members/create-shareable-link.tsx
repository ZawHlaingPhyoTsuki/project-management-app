// "use client";

// import { useState } from "react";
// import { Copy, RefreshCw } from "lucide-react";
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
// import { useCreateShareableLink } from "@/hooks/use-shareable-links";

// interface CreateShareableLinkProps {
//   workspaceId: string;
//   onSuccess: () => void;
// }

// export function CreateShareableLink({
//   workspaceId,
//   onSuccess,
// }: CreateShareableLinkProps) {
//   const [role, setRole] = useState<"MEMBER" | "VIEWER">("MEMBER");
//   const [generatedLink, setGeneratedLink] = useState<string>("");
//   const { mutateAsync: createLink, isPending } = useCreateShareableLink();

//   const generateLink = async () => {
//     try {
//       const result = await createLink({
//         workspaceId,
//         role,
//         resourceType: "WORKSPACE" as const,
//       });

//       if (result.success && result.data) {
//         const link = `${window.location.origin}/join/${result.data.token}`;
//         setGeneratedLink(link);
//         toast.success("Shareable link created");
//       } else {
//         toast.error(result.error || "Failed to create link");
//       }
//     } catch (error) {
//       console.error("Error creating shareable link:", error);
//       toast.error("Something went wrong");
//     }
//   };

//   const copyToClipboard = async () => {
//     if (!generatedLink) return;

//     try {
//       await navigator.clipboard.writeText(generatedLink);
//       toast.success("Link copied to clipboard");
//     } catch (error) {
//       console.error("Error copying to clipboard:", error);
//       toast.error("Failed to copy link");
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="space-y-3">
//         <div className="flex items-center gap-2">
//           <Select
//             value={role}
//             onValueChange={(value: "MEMBER" | "VIEWER") => setRole(value)}
//           >
//             <SelectTrigger className="flex-1">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="MEMBER">Member</SelectItem>
//               <SelectItem value="VIEWER">Viewer</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button onClick={generateLink} disabled={isPending}>
//             {isPending ? (
//               <RefreshCw className="h-4 w-4 animate-spin" />
//             ) : (
//               "Generate Link"
//             )}
//           </Button>
//         </div>

//         {generatedLink && (
//           <div className="space-y-2">
//             <div className="text-sm font-medium">Share this link:</div>
//             <div className="flex gap-2">
//               <Input value={generatedLink} readOnly className="flex-1" />
//               <Button variant="outline" size="icon" onClick={copyToClipboard}>
//                 <Copy className="h-4 w-4" />
//               </Button>
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Anyone with this link can join as a {role.toLowerCase()}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
