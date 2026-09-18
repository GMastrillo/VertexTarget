import { createSupabaseServerClient } from "@/lib/supabase-server";

export type TeamRole = "owner" | "finance" | "sales" | "operations" | "ai_lab";
export type TeamUser = { id: string; email: string; name: string; role: TeamRole };

export async function getAuthenticatedTeamUser(): Promise<TeamUser | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email || !user.email_confirmed_at) return null;

  const { data: member } = await supabase
    .from("team_members")
    .select("display_name, role, active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!member?.active) return null;
  return {
    id: user.id,
    email: user.email,
    name: member.display_name?.trim() || user.user_metadata?.full_name || user.email.split("@")[0],
    role: member.role as TeamRole,
  };
}

export async function requireTeamUser(roles?: TeamRole[]) {
  const user = await getAuthenticatedTeamUser();
  if (!user) return { user: null, status: 401 as const };
  if (roles && !roles.includes(user.role)) return { user: null, status: 403 as const };
  return { user, status: 200 as const };
}
