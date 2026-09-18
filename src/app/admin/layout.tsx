import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAuthenticatedTeamUser } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthenticatedTeamUser();
  if (!user) redirect("/login");
  return <AdminShell user={user}>{children}</AdminShell>;
}
