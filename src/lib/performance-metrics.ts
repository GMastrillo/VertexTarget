import "server-only";
import type { PerformanceContext } from "@/lib/performance-context";
import type { PerformanceMetric, PerformanceProgress } from "@/lib/performance-types";

type MetricRow = { amount_cents?: number | null };

function range(start: string, end: string) {
  return { start: `${start}T00:00:00.000Z`, end: `${end}T23:59:59.999Z` };
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function progress(metric: PerformanceMetric, value: number, target: number): PerformanceProgress {
  const percentage = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
  return { metric, value, target, percentage };
}

export async function metricValue(ctx: PerformanceContext, metric: PerformanceMetric, start: string, end: string, ownerId?: string | null) {
  const dates = range(start, end);

  if (metric === "revenue_cents") {
    const [invoices, sales] = await Promise.all([
      ctx.supabase.from("invoices").select("amount_cents").eq("organization_id", ctx.organizationId).eq("status", "paid").gte("paid_at", dates.start).lte("paid_at", dates.end),
      ctx.supabase.from("manual_sales").select("amount_cents").eq("organization_id", ctx.organizationId).gte("sold_at", start).lte("sold_at", end),
    ]);
    if (invoices.error || sales.error) throw new Error("Falha ao calcular receita real.");
    return (invoices.data ?? []).reduce((sum, row) => sum + Number((row as MetricRow).amount_cents ?? 0), 0) + (sales.data ?? []).reduce((sum, row) => sum + Number((row as MetricRow).amount_cents ?? 0), 0);
  }

  if (metric === "deals_won") {
    let query = ctx.supabase.from("deals").select("id", { count: "exact", head: true }).eq("organization_id", ctx.organizationId).eq("status", "won").gte("updated_at", dates.start).lte("updated_at", dates.end);
    if (ownerId) query = query.eq("owner_id", ownerId);
    const { count, error } = await query;
    if (error) throw new Error("Falha ao calcular negócios ganhos.");
    return count ?? 0;
  }

  if (metric === "tasks_completed") {
    let query = ctx.supabase.from("tasks").select("id", { count: "exact", head: true }).eq("organization_id", ctx.organizationId).eq("status", "done").gte("updated_at", dates.start).lte("updated_at", dates.end);
    if (ownerId) query = query.eq("assignee_id", ownerId);
    const { count, error } = await query;
    if (error) throw new Error("Falha ao calcular tarefas concluídas.");
    return count ?? 0;
  }

  let query = ctx.supabase.from("conversation_messages").select("id", { count: "exact", head: true }).eq("organization_id", ctx.organizationId).eq("message_type", "message").not("author_id", "is", null).gte("created_at", dates.start).lte("created_at", dates.end);
  if (ownerId) query = query.eq("author_id", ownerId);
  const { count, error } = await query;
  if (error) throw new Error("Falha ao calcular mensagens enviadas.");
  return count ?? 0;
}
