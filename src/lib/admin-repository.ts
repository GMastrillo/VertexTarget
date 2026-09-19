import "server-only";
import { aiLogs as mockAiLogs, clients as mockClients, projects as mockProjects, type Client, type Project } from "@/lib/admin-data";
import { getAuthenticatedTeamUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { isSupabaseConfigured } from "@/lib/supabase-config";

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

function mapClient(row: Record<string, unknown>): Client {
  const name = String(row.name ?? "Cliente");
  const cents = Number(row.value_cents ?? 0);
  return {
    id: String(row.id),
    name,
    initials: initials(name),
    service: String(row.service ?? "Serviço não informado"),
    status: row.status === "active" ? "Ativo" : row.status === "paused" ? "Pausado" : "Em negociação",
    value: `${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100)}/${row.billing_type === "monthly" ? "mês" : "projeto"}`,
    email: String(row.email ?? ""),
    since: new Date(String(row.created_at)).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
    description: String(row.description ?? ""),
  };
}

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return mockProjects;
  const user = await getAuthenticatedTeamUser();
  if (!user) return [];
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  let query = supabase.from("projects").select("id,title,project_type,stage,priority,due_date,clients(name)").order("updated_at", { ascending: false });
  if (user.organizationId) query = query.eq("organization_id", user.organizationId);
  const { data, error } = await query;
  if (error) throw new Error("Falha ao carregar projetos do Supabase.");
  return (data ?? []).map((row) => {
    const client = Array.isArray(row.clients) ? row.clients[0] : row.clients;
    return {
      id: String(row.id),
      title: String(row.title),
      client: String((client as { name?: string } | null)?.name ?? "Sem cliente"),
      type: String(row.project_type),
      stage: ({ backlog: "Backlog", design: "Design", development: "Desenvolvimento", qa: "QA", delivered: "Entregue" } as const)[row.stage as "backlog" | "design" | "development" | "qa" | "delivered"] ?? "Backlog",
      priority: ({ high: "Alta", medium: "Média", low: "Baixa" } as const)[row.priority as "high" | "medium" | "low"] ?? "Média",
      due: row.due_date ? new Date(String(row.due_date)).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : "Sem prazo",
    };
  });
}

export async function getAiLogs() {
  if (!isSupabaseConfigured()) return mockAiLogs;
  const user = await getAuthenticatedTeamUser();
  if (!user) return [];
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  let query = supabase.from("ai_runs").select("created_at,automation,model,tokens,status,latency_ms,clients(name)").order("created_at", { ascending: false }).limit(100);
  if (user.organizationId) query = query.eq("organization_id", user.organizationId);
  const { data, error } = await query;
  if (error) throw new Error("Falha ao carregar logs de IA do Supabase.");
  return (data ?? []).map((row) => {
    const client = Array.isArray(row.clients) ? row.clients[0] : row.clients;
    return {
      time: new Date(String(row.created_at)).toLocaleTimeString("pt-BR"),
      automation: String(row.automation),
      client: String((client as { name?: string } | null)?.name ?? "Sem cliente"),
      model: String(row.model),
      tokens: Number(row.tokens).toLocaleString("pt-BR"),
      status: row.status === "success" ? "Sucesso" : "Falha",
      latency: row.latency_ms ? `${row.latency_ms}ms` : "—",
    };
  });
}

export async function getClients(): Promise<Client[]> {
  if (!isSupabaseConfigured()) return mockClients;
  const user = await getAuthenticatedTeamUser();
  if (!user) return [];
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  let query = supabase.from("clients").select("id,name,service,status,value_cents,billing_type,email,description,created_at").order("updated_at", { ascending: false });
  if (user.organizationId) query = query.eq("organization_id", user.organizationId);
  const { data, error } = await query;
  if (error) throw new Error("Falha ao carregar clientes do Supabase.");
  return (data ?? []).map((row) => mapClient(row as Record<string, unknown>));
}
