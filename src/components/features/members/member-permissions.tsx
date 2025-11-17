// import { Crown, Shield, User, Eye, Check, X } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// const permissions = [
//   {
//     feature: "Create boards",
//     owner: true,
//     admin: true,
//     member: true,
//     viewer: false,
//   },
//   {
//     feature: "Edit workspace settings",
//     owner: true,
//     admin: true,
//     member: false,
//     viewer: false,
//   },
//   {
//     feature: "Manage members",
//     owner: true,
//     admin: true,
//     member: false,
//     viewer: false,
//   },
//   {
//     feature: "Archive/delete workspace",
//     owner: true,
//     admin: false,
//     member: false,
//     viewer: false,
//   },
//   {
//     feature: "Create tasks",
//     owner: true,
//     admin: true,
//     member: true,
//     viewer: false,
//   },
//   {
//     feature: "Assign tasks",
//     owner: true,
//     admin: true,
//     member: true,
//     viewer: false,
//   },
//   {
//     feature: "Edit all tasks",
//     owner: true,
//     admin: true,
//     member: false,
//     viewer: false,
//   },
//   {
//     feature: "View only",
//     owner: false,
//     admin: false,
//     member: false,
//     viewer: true,
//   },
// ];

// const roleIcons = {
//   owner: Crown,
//   admin: Shield,
//   member: User,
//   viewer: Eye,
// };

// export function MemberPermissions() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Role Permissions</CardTitle>
//         <CardDescription>
//           Understand what each role can do in this workspace
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b">
//                 <th className="text-left py-3 font-medium">Feature</th>
//                 <th className="text-center py-3">
//                   <div className="flex items-center justify-center gap-1">
//                     <Crown className="h-4 w-4" />
//                     <span>Owner</span>
//                   </div>
//                 </th>
//                 <th className="text-center py-3">
//                   <div className="flex items-center justify-center gap-1">
//                     <Shield className="h-4 w-4" />
//                     <span>Admin</span>
//                   </div>
//                 </th>
//                 <th className="text-center py-3">
//                   <div className="flex items-center justify-center gap-1">
//                     <User className="h-4 w-4" />
//                     <span>Member</span>
//                   </div>
//                 </th>
//                 <th className="text-center py-3">
//                   <div className="flex items-center justify-center gap-1">
//                     <Eye className="h-4 w-4" />
//                     <span>Viewer</span>
//                   </div>
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {permissions.map((permission, index) => (
//                 <tr key={index} className="border-b last:border-0">
//                   <td className="py-3 pr-4">{permission.feature}</td>
//                   <td className="text-center py-3">
//                     {permission.owner ? (
//                       <Check className="h-4 w-4 text-green-600 mx-auto" />
//                     ) : (
//                       <X className="h-4 w-4 text-red-600 mx-auto" />
//                     )}
//                   </td>
//                   <td className="text-center py-3">
//                     {permission.admin ? (
//                       <Check className="h-4 w-4 text-green-600 mx-auto" />
//                     ) : (
//                       <X className="h-4 w-4 text-red-600 mx-auto" />
//                     )}
//                   </td>
//                   <td className="text-center py-3">
//                     {permission.member ? (
//                       <Check className="h-4 w-4 text-green-600 mx-auto" />
//                     ) : (
//                       <X className="h-4 w-4 text-red-600 mx-auto" />
//                     )}
//                   </td>
//                   <td className="text-center py-3">
//                     {permission.viewer ? (
//                       <Check className="h-4 w-4 text-green-600 mx-auto" />
//                     ) : (
//                       <X className="h-4 w-4 text-red-600 mx-auto" />
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
