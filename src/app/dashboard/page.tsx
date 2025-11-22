import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Render the dashboard page for an authenticated user.
 *
 * Redirects to "/sign-in" if no active session is found.
 *
 * @returns The dashboard page React element when a session exists.
 */
export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
   <div>Dashboard Page</div>
  );
}