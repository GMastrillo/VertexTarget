import "server-only";
import { getAuthenticatedTeamUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { PaymentLink } from "@/lib/payment-link-types";

type Supabase = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;
type Context = { supabase: Supabase; userId: string; organizationId: string };
async function context(): Promise<Context> {
  const user = await getAuthenticatedTeamUser();
  if (!user) throw new Error("Sessão não autenticada.");
  if (!user.organizationId) throw new Error("Workspace não configurado. Aplique a migration 003_multi_tenant_foundation.sql e associe o usuário a uma organização.");
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase server não configurado.");
  return { supabase, userId: user.id, organizationId: user.organizationId };
}
function map(row: Record<string, unknown>): PaymentLink { return { id: String(row.id), clientId: row.client_id ? String(row.client_id) : null, dealId: row.deal_id ? String(row.deal_id) : null, stripePaymentLinkId: String(row.stripe_payment_link_id), url: String(row.url), kind: row.kind === "recurring" ? "recurring" : "one_time", status: String(row.status) as PaymentLink["status"], amountCents: Number(row.amount_cents), currency: String(row.currency), recurringInterval: row.recurring_interval === "month" || row.recurring_interval === "year" ? row.recurring_interval : null, installments: Number(row.installments ?? 1), description: String(row.description ?? ""), createdAt: String(row.created_at) }; }

export async function listPaymentLinks(): Promise<PaymentLink[]> { const ctx = await context(); const { data, error } = await ctx.supabase.from("stripe_payment_links").select("id,client_id,deal_id,stripe_payment_link_id,url,kind,status,amount_cents,currency,recurring_interval,installments,description,created_at").eq("organization_id", ctx.organizationId).order("created_at", { ascending: false }).limit(100); if (error) throw new Error("Falha ao carregar Payment Links. A migration 007 pode ainda não estar aplicada."); return (data ?? []).map((row) => map(row as Record<string, unknown>)); }

export async function getPaymentLinksData() { try { return { links: await listPaymentLinks(), error: "" }; } catch (error) { return { links: [], error: error instanceof Error ? error.message : "Payment Links indisponíveis." }; } }

export async function validatePaymentReferences(ctx: Context, clientId?: string, dealId?: string) { if (clientId) { const { data } = await ctx.supabase.from("clients").select("id").eq("organization_id", ctx.organizationId).eq("id", clientId).maybeSingle(); if (!data) throw new Error("Cliente não encontrado neste workspace."); } if (dealId) { const { data } = await ctx.supabase.from("deals").select("id").eq("organization_id", ctx.organizationId).eq("id", dealId).maybeSingle(); if (!data) throw new Error("Negócio não encontrado neste workspace."); } }

export async function insertPaymentLink(ctx: Context, input: { clientId?: string; dealId?: string; stripePaymentLinkId: string; stripePriceId: string; stripeProductId: string; url: string; kind: PaymentLink["kind"]; amountCents: number; currency: string; recurringInterval?: "month" | "year"; installments: number; description: string }) { const { data, error } = await ctx.supabase.from("stripe_payment_links").insert({ organization_id: ctx.organizationId, client_id: input.clientId || null, deal_id: input.dealId || null, stripe_payment_link_id: input.stripePaymentLinkId, stripe_price_id: input.stripePriceId, stripe_product_id: input.stripeProductId, url: input.url, kind: input.kind, status: "active", amount_cents: input.amountCents, currency: input.currency, recurring_interval: input.recurringInterval || null, installments: input.installments, description: input.description.trim(), created_by: ctx.userId }).select("id,client_id,deal_id,stripe_payment_link_id,url,kind,status,amount_cents,currency,recurring_interval,installments,description,created_at").single(); if (error || !data) throw new Error("Payment Link criado, mas não foi persistido."); return map(data as Record<string, unknown>); }

export { context };
