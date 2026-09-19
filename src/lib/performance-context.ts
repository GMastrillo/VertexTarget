import "server-only";
import { getAuthenticatedTeamUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type Supabase = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;

export type PerformanceContext = {
  supabase: Supabase;
  userId: string;
  organizationId: string;
};

export async function getPerformanceContext(): Promise<PerformanceContext> {
  const user = await getAuthenticatedTeamUser();
  if (!user) throw new Error("Sessão não autenticada.");
  if (!user.organizationId) throw new Error("Workspace não configurado. Aplique a migration 003_multi_tenant_foundation.sql.");

  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase server não configurado.");

  return { supabase, userId: user.id, organizationId: user.organizationId };
}
