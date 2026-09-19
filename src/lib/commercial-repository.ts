import "server-only";
import { getAuthenticatedTeamUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { CommercialActivity, CommercialCompany, CommercialContact, CommercialDeal, CommercialSnapshot, CommercialTask } from "@/lib/commercial-types";

type Supabase = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;

type Context = { supabase: Supabase; userId: string; organizationId: string };

async function getContext(): Promise<Context | null> {
  const user = await getAuthenticatedTeamUser();
  const supabase = await createSupabaseServerClient();
  if (!user?.organizationId || !supabase) return null;
  return { supabase, userId: user.id, organizationId: user.organizationId };
}

function relation(row: Record<string, unknown>, key: string): Record<string, unknown> | null {
  const value = row[key];
  return (Array.isArray(value) ? value[0] : value) as Record<string, unknown> | null;
}

function mapCompany(row: Record<string, unknown>): CommercialCompany {
  return { id: String(row.id), name: String(row.name), industry: String(row.industry ?? ""), email: String(row.email ?? ""), phone: String(row.phone ?? ""), website: String(row.website ?? "") };
}

function mapContact(row: Record<string, unknown>): CommercialContact {
  const company = relation(row, "companies");
  return { id: String(row.id), companyId: String(row.company_id), companyName: String(company?.name ?? "Empresa"), name: String(row.name), email: String(row.email ?? ""), phone: String(row.phone ?? ""), jobTitle: String(row.job_title ?? "") };
}

function mapDeal(row: Record<string, unknown>): CommercialDeal {
  const company = relation(row, "companies");
  const contact = relation(row, "contacts");
  const stage = relation(row, "pipeline_stages");
  return { id: String(row.id), title: String(row.title), amountCents: Number(row.amount_cents ?? 0), status: String(row.status), companyId: String(row.company_id), companyName: String(company?.name ?? "Empresa"), contactId: row.contact_id ? String(row.contact_id) : null, contactName: String(contact?.name ?? ""), ownerId: row.owner_id ? String(row.owner_id) : null, pipelineId: String(row.pipeline_id), stageId: String(row.stage_id), stageName: String(stage?.name ?? "Etapa"), expectedCloseDate: row.expected_close_date ? String(row.expected_close_date) : null };
}

function mapTask(row: Record<string, unknown>): CommercialTask {
  const company = relation(row, "companies");
  const deal = relation(row, "deals");
  return { id: String(row.id), title: String(row.title), status: row.status === "done" ? "done" : "open", priority: String(row.priority), dueDate: row.due_date ? String(row.due_date) : null, companyName: String(company?.name ?? ""), dealTitle: String(deal?.title ?? ""), assigneeId: row.assignee_id ? String(row.assignee_id) : null };
}

function mapActivity(row: Record<string, unknown>): CommercialActivity {
  const company = relation(row, "companies");
  const deal = relation(row, "deals");
  return { id: String(row.id), type: String(row.activity_type), body: String(row.body), createdAt: String(row.created_at), actorId: row.actor_id ? String(row.actor_id) : null, dealTitle: String(deal?.title ?? ""), companyName: String(company?.name ?? "") };
}

export async function getCommercialSnapshot(): Promise<CommercialSnapshot> {
  const context = await getContext();
  if (!context) return { companies: [], contacts: [], pipelines: [], deals: [], tasks: [], activities: [] };
  const { supabase, organizationId } = context;
  const [companies, contacts, pipelines, stages, deals, tasks, activities] = await Promise.all([
    supabase.from("companies").select("id,name,industry,email,phone,website").eq("organization_id", organizationId).order("name"),
    supabase.from("contacts").select("id,company_id,name,email,phone,job_title,companies(name)").eq("organization_id", organizationId).order("name"),
    supabase.from("pipelines").select("id,name").eq("organization_id", organizationId).order("name"),
    supabase.from("pipeline_stages").select("id,pipeline_id,name,position,probability").eq("organization_id", organizationId).order("position"),
    supabase.from("deals").select("id,title,amount_cents,status,company_id,contact_id,owner_id,pipeline_id,stage_id,expected_close_date,companies(name),contacts(name),pipeline_stages(name)").eq("organization_id", organizationId).order("updated_at", { ascending: false }),
    supabase.from("tasks").select("id,title,status,priority,due_date,assignee_id,companies(name),deals(title)").eq("organization_id", organizationId).order("status").order("due_date"),
    supabase.from("activities").select("id,activity_type,body,created_at,actor_id,companies(name),deals(title)").eq("organization_id", organizationId).order("created_at", { ascending: false }).limit(40),
  ]);
  if ([companies, contacts, pipelines, stages, deals, tasks, activities].some((result) => result.error)) throw new Error("Falha ao carregar o núcleo comercial.");
  const stageRows = stages.data ?? [];
  return {
    companies: (companies.data ?? []).map((row) => mapCompany(row as Record<string, unknown>)),
    contacts: (contacts.data ?? []).map((row) => mapContact(row as Record<string, unknown>)),
    pipelines: (pipelines.data ?? []).map((row) => ({ id: String(row.id), name: String(row.name), stages: stageRows.filter((stage) => stage.pipeline_id === row.id).map((stage) => ({ id: String(stage.id), name: String(stage.name), position: Number(stage.position), probability: Number(stage.probability) })) })),
    deals: (deals.data ?? []).map((row) => mapDeal(row as Record<string, unknown>)),
    tasks: (tasks.data ?? []).map((row) => mapTask(row as Record<string, unknown>)),
    activities: (activities.data ?? []).map((row) => mapActivity(row as Record<string, unknown>)),
  };
}

export async function createCompany(input: { name: string; industry?: string; email?: string; phone?: string; website?: string }) {
  const context = await getContext();
  if (!context) throw new Error("Workspace não disponível.");
  const { data, error } = await context.supabase.from("companies").insert({ organization_id: context.organizationId, name: input.name.trim(), industry: input.industry?.trim() ?? "", email: input.email?.trim() ?? "", phone: input.phone?.trim() ?? "", website: input.website?.trim() ?? "", owner_id: context.userId }).select("id,name,industry,email,phone,website").single();
  if (error || !data) throw new Error("Não foi possível criar a empresa.");
  return mapCompany(data as Record<string, unknown>);
}

export async function createContact(input: { companyId: string; name: string; email?: string; phone?: string; jobTitle?: string }) {
  const context = await getContext();
  if (!context) throw new Error("Workspace não disponível.");
  const { data, error } = await context.supabase.from("contacts").insert({ organization_id: context.organizationId, company_id: input.companyId, name: input.name.trim(), email: input.email?.trim() ?? "", phone: input.phone?.trim() ?? "", job_title: input.jobTitle?.trim() ?? "" }).select("id,company_id,name,email,phone,job_title,companies(name)").single();
  if (error || !data) throw new Error("Não foi possível criar o contato.");
  return mapContact(data as Record<string, unknown>);
}

export async function createDeal(input: { title: string; companyId: string; contactId?: string; pipelineId: string; stageId: string; amountCents?: number; expectedCloseDate?: string }) {
  const context = await getContext();
  if (!context) throw new Error("Workspace não disponível.");
  const { data, error } = await context.supabase.from("deals").insert({ organization_id: context.organizationId, company_id: input.companyId, contact_id: input.contactId || null, owner_id: context.userId, pipeline_id: input.pipelineId, stage_id: input.stageId, title: input.title.trim(), amount_cents: input.amountCents ?? 0, expected_close_date: input.expectedCloseDate || null }).select("id,title,amount_cents,status,company_id,contact_id,owner_id,pipeline_id,stage_id,expected_close_date,companies(name),contacts(name),pipeline_stages(name)").single();
  if (error || !data) throw new Error("Não foi possível criar o negócio.");
  await context.supabase.from("activities").insert({ organization_id: context.organizationId, company_id: input.companyId, contact_id: input.contactId || null, deal_id: data.id, actor_id: context.userId, activity_type: "deal_created", body: `Negócio criado: ${input.title.trim()}` });
  return mapDeal(data as Record<string, unknown>);
}

export async function updateDeal(dealId: string, input: { title: string; amountCents: number }) {
  const context = await getContext();
  if (!context) throw new Error("Workspace não disponível.");
  const { error } = await context.supabase.from("deals").update({ title: input.title.trim(), amount_cents: input.amountCents, updated_at: new Date().toISOString() }).eq("organization_id", context.organizationId).eq("id", dealId);
  if (error) throw new Error("Não foi possível editar o negócio.");
  await context.supabase.from("activities").insert({ organization_id: context.organizationId, deal_id: dealId, actor_id: context.userId, activity_type: "note", body: `Negócio editado: ${input.title.trim()}` });
}

export async function moveDeal(dealId: string, stageId: string) {
  const context = await getContext();
  if (!context) throw new Error("Workspace não disponível.");
  const { data: deal } = await context.supabase.from("deals").select("company_id,contact_id,pipeline_id,stage_id,title").eq("organization_id", context.organizationId).eq("id", dealId).maybeSingle();
  if (!deal) throw new Error("Negócio não encontrado neste workspace.");
  const { data: stage } = await context.supabase.from("pipeline_stages").select("id,name,pipeline_id").eq("organization_id", context.organizationId).eq("id", stageId).maybeSingle();
  if (!stage || stage.pipeline_id !== deal.pipeline_id) throw new Error("Etapa inválida para este negócio.");
  const { error } = await context.supabase.from("deals").update({ stage_id: stageId, updated_at: new Date().toISOString() }).eq("organization_id", context.organizationId).eq("id", dealId);
  if (error) throw new Error("Não foi possível mover o negócio.");
  await context.supabase.from("activities").insert({ organization_id: context.organizationId, company_id: deal.company_id, contact_id: deal.contact_id, deal_id: dealId, actor_id: context.userId, activity_type: "stage_changed", body: `Etapa alterada para ${stage.name}` });
}

export async function createTask(input: { title: string; companyId?: string; contactId?: string; dealId?: string; dueDate?: string; priority?: string }) {
  const context = await getContext();
  if (!context) throw new Error("Workspace não disponível.");
  const { data, error } = await context.supabase.from("tasks").insert({ organization_id: context.organizationId, company_id: input.companyId || null, contact_id: input.contactId || null, deal_id: input.dealId || null, assignee_id: context.userId, title: input.title.trim(), due_date: input.dueDate || null, priority: input.priority || "medium" }).select("id,title,status,priority,due_date,assignee_id,companies(name),deals(title)").single();
  if (error || !data) throw new Error("Não foi possível criar a tarefa.");
  await context.supabase.from("activities").insert({ organization_id: context.organizationId, company_id: input.companyId || null, contact_id: input.contactId || null, deal_id: input.dealId || null, actor_id: context.userId, activity_type: "task_created", body: `Tarefa criada: ${input.title.trim()}` });
  return mapTask(data as Record<string, unknown>);
}

export async function toggleTask(taskId: string, done: boolean) {
  const context = await getContext();
  if (!context) throw new Error("Workspace não disponível.");
  const { data: task } = await context.supabase.from("tasks").select("company_id,contact_id,deal_id,title").eq("organization_id", context.organizationId).eq("id", taskId).maybeSingle();
  if (!task) throw new Error("Tarefa não encontrada neste workspace.");
  const { error } = await context.supabase.from("tasks").update({ status: done ? "done" : "open", updated_at: new Date().toISOString() }).eq("organization_id", context.organizationId).eq("id", taskId);
  if (error) throw new Error("Não foi possível atualizar a tarefa.");
  await context.supabase.from("activities").insert({ organization_id: context.organizationId, company_id: task.company_id, contact_id: task.contact_id, deal_id: task.deal_id, actor_id: context.userId, activity_type: "task_completed", body: done ? `Tarefa concluída: ${task.title}` : `Tarefa reaberta: ${task.title}` });
}
