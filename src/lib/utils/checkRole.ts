// import { headers } from "next/headers";
// import { auth } from "../auth";

// export async function checkRole(allowedRoles: string[]) {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session || !allowedRoles.includes(session.user.role)) {
//     throw new Error("Forbidden");
//   }
//   return user;
// }
