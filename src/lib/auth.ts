/* eslint-disable complexity -- authentication must fail closed across session, membership and workspace checks. */
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getWorkspaceMemberships, selectActiveWorkspace, type Workspace } from "@/lib/workspace";

export type TeamRole = "owner" | "finance" | "sales" | "operations" | "ai_lab";
export type TeamUser = {
  id: string;
  email: string;
  name: string;
  role: TeamRole;
  organizationId: string | null;
  organizationName: string | null;
  organizations: Workspace[];
};

type LegacyMember = { display_name: string | null; role: TeamRole; active: boolean };

async function getLegacyMember(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, userId: string): Promise<LegacyMember | null> {
  if (!supabase) return null;
  const { data } = await supabase.from("team_members").select("display_name, role, active").eq("user_id", userId).maybeSingle();
  return data as LegacyMember | null;
}

async function getConfirmedUser(supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email || !user.email_confirmed_at) return null;
  return { id: user.id, email: user.email, email_confirmed_at: user.email_confirmed_at, user_metadata: user.user_metadata };
}

export async function getAuthenticatedTeamUser(): Promise<TeamUser | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const user = await getConfirmedUser(supabase);
  if (!user) return null;

  const member = await getLegacyMember(supabase, user.id);
  if (!member?.active) return null;

  const organizations = await getWorkspaceMemberships(supabase, user.id);
  const workspace = await selectActiveWorkspace(organizations);
  if (organizations !== null && !workspace) return null;
  return {
    id: user.id,
    email: user.email,
    name: member.display_name?.trim() || user.user_metadata?.full_name || user.email.split("@")[0],
    role: workspace?.role ?? member.role,
    organizationId: workspace?.id ?? null,
    organizationName: workspace?.name ?? null,
    organizations: organizations ?? [],
  };
}

export async function requireTeamUser(roles?: TeamRole[]) {
  const user = await getAuthenticatedTeamUser();
  if (!user) return { user: null, status: 401 as const };
  if (roles && !roles.includes(user.role)) return { user: null, status: 403 as const };
  return { user, status: 200 as const };
}
