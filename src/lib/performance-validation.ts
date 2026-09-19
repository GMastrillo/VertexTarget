import type { PerformanceMetric } from "@/lib/performance-types";
export type PerformanceAction =
  | { action: "goal.create"; title: string; metric: PerformanceMetric; targetValue: number; periodStart: string; periodEnd: string; scope: "individual" | "team" }
  | { action: "goal.update"; goalId: string; title: string; targetValue: number; periodStart: string; periodEnd: string; status: "active" | "archived" }
  | { action: "challenge.create"; title: string; metric: PerformanceMetric; targetValue: number; periodStart: string; periodEnd: string }
  | { action: "achievement.create"; title: string; description: string; metric: PerformanceMetric; targetValue: number };
const id = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value);
const text = (value: unknown, max: number): value is string => typeof value === "string" && value.trim().length >= 2 && value.trim().length <= max;
const metric = (value: unknown): value is PerformanceMetric => ["revenue_cents", "deals_won", "tasks_completed", "messages_sent"].includes(String(value));
const date = (value: unknown): value is string => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
const target = (value: unknown): value is number => Number.isInteger(value) && Number(value) > 0 && Number(value) <= 100_000_000_000;
export function parsePerformanceAction(input: unknown): { ok: true; value: PerformanceAction } | { ok: false; reason: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, reason: "body" };
  const body = input as Record<string, unknown>;
  if (Object.prototype.hasOwnProperty.call(body, "organization_id") || Object.prototype.hasOwnProperty.call(body, "owner_id")) return { ok: false, reason: "server-owned fields" };
  if (body.action === "goal.create" && text(body.title, 160) && metric(body.metric) && target(body.targetValue) && date(body.periodStart) && date(body.periodEnd) && body.periodEnd >= body.periodStart && (body.scope === "individual" || body.scope === "team")) return { ok: true, value: { action: body.action, title: body.title, metric: body.metric, targetValue: body.targetValue, periodStart: body.periodStart, periodEnd: body.periodEnd, scope: body.scope } };
  if (body.action === "goal.update" && id(body.goalId) && text(body.title, 160) && target(body.targetValue) && date(body.periodStart) && date(body.periodEnd) && body.periodEnd >= body.periodStart && (body.status === "active" || body.status === "archived")) return { ok: true, value: { action: body.action, goalId: body.goalId, title: body.title, targetValue: body.targetValue, periodStart: body.periodStart, periodEnd: body.periodEnd, status: body.status } };
  if (body.action === "challenge.create" && text(body.title, 160) && metric(body.metric) && target(body.targetValue) && date(body.periodStart) && date(body.periodEnd) && body.periodEnd >= body.periodStart) return { ok: true, value: { action: body.action, title: body.title, metric: body.metric, targetValue: body.targetValue, periodStart: body.periodStart, periodEnd: body.periodEnd } };
  if (body.action === "achievement.create" && text(body.title, 120) && text(body.description, 300) && metric(body.metric) && target(body.targetValue)) return { ok: true, value: { action: body.action, title: body.title, description: body.description, metric: body.metric, targetValue: body.targetValue } };
  return { ok: false, reason: "payload" };
}
