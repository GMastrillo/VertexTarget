import { NextResponse } from "next/server";
import { requireTeamUser } from "@/lib/auth";
// API route intentionally reads the authenticated activity feed directly.
// eslint-disable-next-line quality/no-direct-data-access
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  const auth = await requireTeamUser();
  if (!auth.user) return NextResponse.json({ error: "Não autorizado." }, { status: auth.status });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ runs: [] });

  let query = supabase
    .from("ai_runs")
    .select("automation,status,created_at")
    .order("created_at", { ascending: false })
    .limit(6);
  if (auth.user.organizationId) query = query.eq("organization_id", auth.user.organizationId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ runs: [] });

  return NextResponse.json({
    runs: (data ?? []).map((row) => ({
      automation: String(row.automation),
      status: row.status === "success" ? "Sucesso" : "Falha",
      time: new Date(String(row.created_at)).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    })),
  });
}
