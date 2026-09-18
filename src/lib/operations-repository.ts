import "server-only";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase-server";
import { getAuthenticatedTeamUser } from "@/lib/auth";

export type ManualSale = {
  id: string;
  clientName: string;
  description: string;
  amountCents: number;
  method: "pix" | "cash" | "transfer" | "other";
  soldAt: string;
};

export type Prospect = {
  id: string;
  companyName: string;
  category: string;
  city: string;
  region: string;
  country: string;
  website: string;
  phone: string;
  opportunity: string;
  score: number;
  status: "new" | "contacted" | "client" | "discarded";
  createdAt: string;
};

const dollars = (n: unknown) => Number(n ?? 0);

export async function listManualSales(limit = 200): Promise<ManualSale[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const user = await getAuthenticatedTeamUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("manual_sales")
    .select("id,client_name,description,amount_cents,method,sold_at")
    .order("sold_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error("Falha ao carregar vendas manuais.");
  return (data ?? []).map((row) => ({
    id: String(row.id),
    clientName: String(row.client_name),
    description: String(row.description ?? ""),
    amountCents: dollars(row.amount_cents),
    method: (row.method ?? "pix") as ManualSale["method"],
    soldAt: String(row.sold_at),
  }));
}

export async function listProspects(): Promise<Prospect[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const user = await getAuthenticatedTeamUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("prospects")
    .select("id,company_name,category,city,region,country,website,phone,opportunity,score,status,created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error("Falha ao carregar prospects.");
  return (data ?? []).map((row) => ({
    id: String(row.id),
    companyName: String(row.company_name),
    category: String(row.category ?? ""),
    city: String(row.city ?? ""),
    region: String(row.region ?? ""),
    country: String(row.country ?? ""),
    website: String(row.website ?? ""),
    phone: String(row.phone ?? ""),
    opportunity: String(row.opportunity ?? ""),
    score: dollars(row.score),
    status: (row.status ?? "new") as Prospect["status"],
    createdAt: String(row.created_at),
  }));
}

// Overview aggregates for the dashboard home: recent runs + 24h counters.
export async function listAiRunsOverview() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { recent: [] as { key: string; automation: string; model: string; status: string; time: string }[], total24h: 0, success24h: 0 };
  const user = await getAuthenticatedTeamUser();
  if (!user) return { recent: [], total24h: 0, success24h: 0 };
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const [{ data: recent }, { data: last24h }] = await Promise.all([
    supabase.from("ai_runs").select("automation,model,status,created_at").order("created_at", { ascending: false }).limit(4),
    supabase.from("ai_runs").select("status,created_at").gte("created_at", since),
  ]);
  const rows24 = last24h ?? [];
  return {
    recent: (recent ?? []).map((row, i) => ({
      key: `${row.created_at}-${i}`,
      automation: String(row.automation),
      model: String(row.model),
      status: row.status === "success" ? "Sucesso" : "Falha",
      time: new Date(String(row.created_at)).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    })),
    total24h: rows24.length,
    success24h: rows24.filter((r) => r.status === "success").length,
  };
}

export type AiRunLog = {
  automation: string;
  model: string;
  status: "success" | "error";
  tokens: number;
  latencyMs: number | null;
  errorCode: string | null;
};

// Best-effort logging of every Gemini call made by internal tools. Written with
// the admin client because prospect runs may happen before any client row exists;
// failures here must never break the user-facing flow.
export async function logAiRun(run: AiRunLog) {
  try {
    const admin = createSupabaseAdminClient();
    if (!admin) return;
    const user = await getAuthenticatedTeamUser();
    await admin.from("ai_runs").insert({
      automation: run.automation,
      model: run.model,
      status: run.status,
      tokens: run.tokens,
      latency_ms: run.latencyMs,
      error_code: run.errorCode,
      client_id: null,
      // audit-style metadata: who triggered it, no payload content persisted
      created_by: user?.id ?? null,
    });
  } catch {
    // Observability is best-effort by design.
  }
}
