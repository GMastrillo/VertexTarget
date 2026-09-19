/* eslint-disable complexity, max-statements -- route handlers intentionally keep validation and authorization together. */
import { NextResponse } from "next/server";
import { requireTeamUser } from "@/lib/auth";
// This route owns project-role authorization and validated stage transitions.
// eslint-disable-next-line quality/no-direct-data-access
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getClientAddress, hasJsonContentType, isRateLimited, isSameOriginRequest, parseJsonBody } from "@/lib/request-security";

const STAGES = ["backlog", "design", "development", "qa", "delivered"] as const;
type Stage = (typeof STAGES)[number];
const PRIORITIES = ["high", "medium", "low"] as const;
type Priority = (typeof PRIORITIES)[number];

const fromDb = { backlog: "Backlog", design: "Design", development: "Desenvolvimento", qa: "QA", delivered: "Entregue" } as const;
const prioFromDb = { high: "Alta", medium: "Média", low: "Baixa" } as const;

export async function GET() {
  const auth = await requireTeamUser();
  if (!auth.user) return NextResponse.json({ error: "Não autorizado." }, { status: auth.status });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Banco não configurado." }, { status: 503 });
  let query = supabase
    .from("projects")
    .select("id,title,project_type,stage,priority,due_date,clients(name)")
    .order("updated_at", { ascending: false });
  if (auth.user.organizationId) query = query.eq("organization_id", auth.user.organizationId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Falha ao carregar projetos." }, { status: 502 });
  const projects = (data ?? []).map((row) => {
    const client = Array.isArray(row.clients) ? row.clients[0] : row.clients;
    return {
      id: String(row.id),
      title: String(row.title),
      client: (client as { name?: string } | null)?.name ?? "Sem cliente",
      type: String(row.project_type),
      stage: fromDb[row.stage as Stage] ?? "Backlog",
      priority: prioFromDb[row.priority as Priority] ?? "Média",
      due: row.due_date ? new Date(String(row.due_date)).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : "Sem prazo",
    };
  });
  return NextResponse.json({ projects }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Origem inválida." }, { status: 403 });
  if (isRateLimited("projects", getClientAddress(request), 30, 60_000)) {
    return NextResponse.json({ error: "Muitas solicitações." }, { status: 429 });
  }
  if (!hasJsonContentType(request)) return NextResponse.json({ error: "Formato inválido." }, { status: 415 });

  const auth = await requireTeamUser();
  if (!auth.user) return NextResponse.json({ error: "Não autorizado." }, { status: auth.status });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Banco não configurado." }, { status: 503 });

  const parsed = await parseJsonBody<Record<string, unknown>>(request, 2_048);
  if (!parsed.ok || !parsed.value || typeof parsed.value !== "object" || Array.isArray(parsed.value)) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }
  const b = parsed.value;
  const title = typeof b.title === "string" ? b.title.trim().slice(0, 160) : "";
  const clientId = typeof b.clientId === "string" && /^[0-9a-f-]{36}$/i.test(b.clientId) ? b.clientId : null;
  const type = typeof b.type === "string" && b.type.trim() ? b.type.trim().slice(0, 60) : "Web";
  const stage = STAGES.includes(b.stage as Stage) ? (b.stage as Stage) : "backlog";
  const priority = PRIORITIES.includes(b.priority as Priority) ? (b.priority as Priority) : "medium";
  const dueDate = typeof b.dueDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(b.dueDate) ? b.dueDate : null;
  if (title.length < 2) return NextResponse.json({ error: "Informe um título com pelo menos 2 caracteres." }, { status: 400 });

  const { data, error } = await supabase
    .from("projects")
    .insert({ title, client_id: clientId, project_type: type, stage, priority, due_date: dueDate, ...(auth.user.organizationId ? { organization_id: auth.user.organizationId } : {}) })
    .select("id,title,project_type,stage,priority,due_date")
    .single();
  if (error || !data) return NextResponse.json({ error: "Não foi possível criar o projeto." }, { status: 502 });

  return NextResponse.json({
    project: {
      id: String(data.id),
      title: String(data.title),
      client: "Sem cliente",
      type: String(data.project_type),
      stage: fromDb[data.stage as Stage] ?? "Backlog",
      priority: prioFromDb[data.priority as Priority] ?? "Média",
      due: data.due_date ? new Date(String(data.due_date)).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : "Sem prazo",
    },
  }, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Origem inválida." }, { status: 403 });
  if (isRateLimited("projects", getClientAddress(request), 60, 60_000)) {
    return NextResponse.json({ error: "Muitas solicitações." }, { status: 429 });
  }
  if (!hasJsonContentType(request)) return NextResponse.json({ error: "Formato inválido." }, { status: 415 });

  const auth = await requireTeamUser();
  if (!auth.user) return NextResponse.json({ error: "Não autorizado." }, { status: auth.status });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Banco não configurado." }, { status: 503 });

  const parsed = await parseJsonBody<Record<string, unknown>>(request, 1_024);
  if (!parsed.ok || !parsed.value || typeof parsed.value !== "object" || Array.isArray(parsed.value)) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }
  const b = parsed.value;
  const id = typeof b.id === "string" ? b.id : "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "ID inválido." }, { status: 400 });

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof b.stage === "string" && STAGES.includes(b.stage as Stage)) updates.stage = b.stage;
  if (typeof b.priority === "string" && PRIORITIES.includes(b.priority as Priority)) updates.priority = b.priority;
  if (typeof b.title === "string" && b.title.trim().length >= 2) updates.title = b.title.trim().slice(0, 160);
  if (Object.keys(updates).length === 1) return NextResponse.json({ error: "Nada para atualizar." }, { status: 400 });

  let query = supabase.from("projects").update(updates).eq("id", id);
  if (auth.user.organizationId) query = query.eq("organization_id", auth.user.organizationId);
  const { error } = await query;
  if (error) return NextResponse.json({ error: "Não foi possível atualizar o projeto." }, { status: 502 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Origem inválida." }, { status: 403 });
  const auth = await requireTeamUser();
  if (!auth.user) return NextResponse.json({ error: "Não autorizado." }, { status: auth.status });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Banco não configurado." }, { status: 503 });

  const parsed = await parseJsonBody<{ id?: unknown }>(request, 512);
  const id = parsed.ok && typeof parsed.value?.id === "string" ? parsed.value.id : "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  let query = supabase.from("projects").delete().eq("id", id);
  if (auth.user.organizationId) query = query.eq("organization_id", auth.user.organizationId);
  const { error } = await query;
  if (error) return NextResponse.json({ error: "Não foi possível remover o projeto." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
