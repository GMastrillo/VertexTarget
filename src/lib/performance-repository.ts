import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { getPerformanceContext, type PerformanceContext } from "@/lib/performance-context";
import { metricValue, progress, today } from "@/lib/performance-metrics";
import type {
  PerformanceAchievement,
  PerformanceChallenge,
  PerformanceGoal,
  PerformanceMetric,
  PerformanceRanking,
  PerformanceSnapshot,
} from "@/lib/performance-types";

type PerformanceRow = Record<string, unknown>;

async function mapGoal(ctx: PerformanceContext, row: PerformanceRow): Promise<PerformanceGoal> {
  const metric = row.metric as PerformanceMetric;
  const target = Number(row.target_value);
  const current = await metricValue(ctx, metric, String(row.period_start), String(row.period_end), row.owner_id ? String(row.owner_id) : null);
  return {
    id: String(row.id),
    ownerId: row.owner_id ? String(row.owner_id) : null,
    title: String(row.title),
    metric,
    targetValue: target,
    currentValue: current,
    periodStart: String(row.period_start),
    periodEnd: String(row.period_end),
    status: row.status as PerformanceGoal["status"],
    progress: progress(metric, current, target),
  };
}

async function mapChallenge(ctx: PerformanceContext, row: PerformanceRow): Promise<PerformanceChallenge> {
  const metric = row.metric as PerformanceMetric;
  const target = Number(row.target_value);
  const current = await metricValue(ctx, metric, String(row.period_start), String(row.period_end));
  return {
    id: String(row.id),
    title: String(row.title),
    metric,
    targetValue: target,
    currentValue: current,
    periodStart: String(row.period_start),
    periodEnd: String(row.period_end),
    status: row.status as PerformanceChallenge["status"],
    progress: progress(metric, current, target),
  };
}

async function getRanking(ctx: PerformanceContext, start: string, end: string): Promise<PerformanceRanking[]> {
  const memberships = await ctx.supabase
    .from("organization_members")
    .select("user_id")
    .eq("organization_id", ctx.organizationId)
    .eq("active", true);
  if (memberships.error) throw new Error("Falha ao carregar ranking da equipe.");

  const userIds = (memberships.data ?? []).map((row) => row.user_id);
  if (!userIds.length) return [];

  const members = await ctx.supabase.from("team_members").select("user_id,display_name").in("user_id", userIds);
  if (members.error) throw new Error("Falha ao carregar nomes da equipe.");

  const rows = await Promise.all(userIds.map(async (userId) => {
    const [dealsWon, tasksCompleted, messagesSent] = await Promise.all([
      metricValue(ctx, "deals_won", start, end, userId),
      metricValue(ctx, "tasks_completed", start, end, userId),
      metricValue(ctx, "messages_sent", start, end, userId),
    ]);
    const member = members.data?.find((row) => row.user_id === userId);
    return {
      userId,
      name: String(member?.display_name ?? "Membro da equipe"),
      score: dealsWon * 100 + tasksCompleted * 10 + messagesSent,
      dealsWon,
      tasksCompleted,
    };
  }));

  return rows.sort((left, right) => right.score - left.score);
}

async function loadDefinitionRows(ctx: PerformanceContext) {
  const [goals, challenges, achievements] = await Promise.all([
    ctx.supabase
      .from("performance_goals")
      .select("id,owner_id,title,metric,target_value,period_start,period_end,status")
      .eq("organization_id", ctx.organizationId)
      .neq("status", "archived")
      .order("period_end"),
    ctx.supabase
      .from("performance_challenges")
      .select("id,title,metric,target_value,period_start,period_end,status")
      .eq("organization_id", ctx.organizationId)
      .neq("status", "archived")
      .order("period_end"),
    ctx.supabase
      .from("performance_achievements")
      .select("id,title,description,metric,target_value")
      .eq("organization_id", ctx.organizationId)
      .order("created_at"),
  ]);
  if (goals.error || challenges.error || achievements.error) throw new Error("Performance indisponível. Aplique a migration 008_performance.sql.");
  return { goals: goals.data ?? [], challenges: challenges.data ?? [], achievements: achievements.data ?? [] };
}

async function mapAchievements(ctx: PerformanceContext, rows: PerformanceRow[]): Promise<PerformanceAchievement[]> {
  const awards = await ctx.supabase
    .from("performance_awards")
    .select("achievement_id")
    .eq("organization_id", ctx.organizationId)
    .eq("user_id", ctx.userId);
  if (awards.error) throw new Error("Performance indisponível. Aplique a migration 008_performance.sql.");

  const current = today();
  const mapped = await Promise.all(rows.map(async (row) => {
    const metric = row.metric as PerformanceMetric;
    const currentValue = await metricValue(ctx, metric, "2020-01-01", current, ctx.userId);
    return {
      id: String(row.id),
      title: String(row.title),
      description: String(row.description),
      metric,
      targetValue: Number(row.target_value),
      currentValue,
      awardedToCurrentUser: (awards.data ?? []).some((award) => award.achievement_id === row.id),
    } satisfies PerformanceAchievement;
  }));

  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY é necessária para registrar conquistas.");
  for (const achievement of mapped.filter((item) => item.currentValue >= item.targetValue && !item.awardedToCurrentUser)) {
    const { error } = await admin.from("performance_awards").upsert(
      {
        organization_id: ctx.organizationId,
        achievement_id: achievement.id,
        user_id: ctx.userId,
        metric_value: achievement.currentValue,
      },
      { onConflict: "organization_id,achievement_id,user_id", ignoreDuplicates: true },
    );
    if (error) throw new Error("Não foi possível registrar a conquista.");
    achievement.awardedToCurrentUser = true;
  }
  return mapped;
}

export async function getPerformanceSnapshot(): Promise<PerformanceSnapshot> {
  const ctx = await getPerformanceContext();
  const definitions = await loadDefinitionRows(ctx);
  const [goals, challenges, achievements] = await Promise.all([
    Promise.all(definitions.goals.map((row) => mapGoal(ctx, row as PerformanceRow))),
    Promise.all(definitions.challenges.map((row) => mapChallenge(ctx, row as PerformanceRow))),
    mapAchievements(ctx, definitions.achievements as PerformanceRow[]),
  ]);
  const ranking = await getRanking(ctx, `${new Date().getFullYear()}-01-01`, today());
  const hasRealEvents = ranking.some((row) => row.score > 0)
    || goals.some((goal) => goal.currentValue > 0)
    || challenges.some((challenge) => challenge.currentValue > 0)
    || achievements.some((achievement) => achievement.currentValue > 0);
  return { goals, challenges, achievements, ranking, hasRealEvents };
}

export async function createGoal(input: { title: string; metric: PerformanceMetric; targetValue: number; periodStart: string; periodEnd: string; scope: "individual" | "team" }) {
  const ctx = await getPerformanceContext();
  const { data, error } = await ctx.supabase.from("performance_goals").insert({
    organization_id: ctx.organizationId,
    owner_id: input.scope === "individual" ? ctx.userId : null,
    title: input.title.trim(),
    metric: input.metric,
    target_value: input.targetValue,
    period_start: input.periodStart,
    period_end: input.periodEnd,
    created_by: ctx.userId,
  }).select("id").single();
  if (error || !data) throw new Error("Não foi possível criar a meta.");
  return data.id;
}

export async function updateGoal(input: { goalId: string; title: string; targetValue: number; periodStart: string; periodEnd: string; status: "active" | "archived" }) {
  const ctx = await getPerformanceContext();
  const { error } = await ctx.supabase.from("performance_goals").update({
    title: input.title.trim(),
    target_value: input.targetValue,
    period_start: input.periodStart,
    period_end: input.periodEnd,
    status: input.status,
    updated_at: new Date().toISOString(),
  }).eq("organization_id", ctx.organizationId).eq("id", input.goalId);
  if (error) throw new Error("Não foi possível editar a meta.");
}

export async function createChallenge(input: { title: string; metric: PerformanceMetric; targetValue: number; periodStart: string; periodEnd: string }) {
  const ctx = await getPerformanceContext();
  const { error } = await ctx.supabase.from("performance_challenges").insert({
    organization_id: ctx.organizationId,
    title: input.title.trim(),
    metric: input.metric,
    target_value: input.targetValue,
    period_start: input.periodStart,
    period_end: input.periodEnd,
    created_by: ctx.userId,
  });
  if (error) throw new Error("Não foi possível criar o desafio.");
}

export async function createAchievement(input: { title: string; description: string; metric: PerformanceMetric; targetValue: number }) {
  const ctx = await getPerformanceContext();
  const { error } = await ctx.supabase.from("performance_achievements").insert({
    organization_id: ctx.organizationId,
    title: input.title.trim(),
    description: input.description.trim(),
    metric: input.metric,
    target_value: input.targetValue,
    created_by: ctx.userId,
  });
  if (error) throw new Error("Não foi possível criar a conquista.");
}
