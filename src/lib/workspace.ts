import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  role: "owner" | "finance" | "sales" | "operations" | "ai_lab";
};

const WORKSPACE_COOKIE = "vt-org-id";

export async function getWorkspaceMemberships(supabase: SupabaseClient, userId: string): Promise<Workspace[] | null> {
  const { data, error } = await supabase
    .from("organization_members")
    .select("organization_id,role,organizations(id,name,slug)")
    .eq("user_id", userId)
    .eq("active", true);
  if (error) return null;
  if (!data?.length) return [];

  return data.flatMap((row) => {
    const organization = Array.isArray(row.organizations) ? row.organizations[0] : row.organizations;
    return organization ? [{
      id: String(organization.id),
      name: String(organization.name),
      slug: String(organization.slug),
      role: String(row.role) as Workspace["role"],
    }] : [];
  });
}

export async function selectActiveWorkspace(workspaces: Workspace[] | null): Promise<Workspace | null> {
  if (!workspaces?.length) return null;
  const requestedId = (await cookies()).get(WORKSPACE_COOKIE)?.value;
  return workspaces.find((workspace) => workspace.id === requestedId) ?? workspaces[0];
}

export function workspaceCookieName() {
  return WORKSPACE_COOKIE;
}
