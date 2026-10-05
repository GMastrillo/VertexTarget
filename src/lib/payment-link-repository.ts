import "server-only";
import { getAuthenticatedTeamUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type {
  PaymentLink,
  PaymentResourceIds,
} from "@/lib/payment-link-types";
import type { PaymentLinkAction } from "@/lib/payment-link-validation";

type Supabase = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;
export type Context = { supabase: Supabase; userId: string; organizationId: string };

export async function context(): Promise<Context> {
  const user = await getAuthenticatedTeamUser();
  if (!user) throw new Error("Sessão não autenticada.");
  if (!user.organizationId) {
    throw new Error(
      "Workspace não configurado. Associe o usuário a uma organização."
    );
  }
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase server não configurado.");
  return { supabase, userId: user.id, organizationId: user.organizationId };
}

function map(row: Record<string, unknown>): PaymentLink {
  return {
    id: String(row.id),
    clientId: row.client_id ? String(row.client_id) : null,
    dealId: row.deal_id ? String(row.deal_id) : null,
    stripePaymentLinkId: String(row.stripe_payment_link_id),
    url: String(row.url),
    kind: row.kind === "recurring" ? "recurring" : "one_time",
    status: String(row.status) as PaymentLink["status"],
    amountCents: Number(row.amount_cents),
    currency: String(row.currency),
    recurringInterval:
      row.recurring_interval === "month" || row.recurring_interval === "year"
        ? row.recurring_interval
        : null,
    installments: Number(row.installments ?? 1),
    description: String(row.description ?? ""),
    createdAt: String(row.created_at),
    requestId: row.request_id ? String(row.request_id) : null,
  };
}

export async function listPaymentLinks(): Promise<PaymentLink[]> {
  const ctx = await context();
  const { data, error } = await ctx.supabase
    .from("stripe_payment_links")
    .select(
      "id,client_id,deal_id,stripe_payment_link_id,url,kind,status,amount_cents,currency,recurring_interval,installments,description,created_at,request_id"
    )
    .eq("organization_id", ctx.organizationId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    throw new Error("Falha ao carregar Payment Links.");
  }
  return (data ?? []).map((row) => map(row as Record<string, unknown>));
}

export async function getPaymentLinksData() {
  try {
    return { links: await listPaymentLinks(), error: "" };
  } catch (error) {
    return {
      links: [],
      error: error instanceof Error ? error.message : "Payment Links indisponíveis.",
    };
  }
}

export async function validatePaymentReferences(
  ctx: Context,
  clientId?: string,
  dealId?: string
) {
  if (clientId) {
    const { data } = await ctx.supabase
      .from("clients")
      .select("id")
      .eq("organization_id", ctx.organizationId)
      .eq("id", clientId)
      .maybeSingle();
    if (!data) throw new Error("Cliente não encontrado neste workspace.");
  }
  if (dealId) {
    const { data } = await ctx.supabase
      .from("deals")
      .select("id")
      .eq("organization_id", ctx.organizationId)
      .eq("id", dealId)
      .maybeSingle();
    if (!data) throw new Error("Negócio não encontrado neste workspace.");
  }
}

export async function claimPaymentOperation(
  ctx: Context,
  requestId: string,
  payloadHash: string
): Promise<{
  operationId: string;
  completedLink: PaymentLink | null;
  executor: boolean;
}> {
  const { data: existing } = await ctx.supabase
    .from("stripe_payment_link_operations")
    .select("id,status,payload_hash,payment_link_id")
    .eq("organization_id", ctx.organizationId)
    .eq("request_id", requestId)
    .maybeSingle();

  if (existing) {
    if (existing.payload_hash !== payloadHash) {
      throw new Error("Conflict: requestId already used with different payload");
    }
    if (existing.status === "completed" && existing.payment_link_id) {
      const { data: linkRow } = await ctx.supabase
        .from("stripe_payment_links")
        .select("*")
        .eq("id", existing.payment_link_id)
        .maybeSingle();
      if (linkRow) {
        return {
          operationId: existing.id,
          completedLink: map(linkRow as Record<string, unknown>),
          executor: false,
        };
      }
    }
    if (existing.status === "pending") {
      throw new Error("Conflict: operation currently in progress");
    }
    // If failed, retry by updating to pending
    await ctx.supabase
      .from("stripe_payment_link_operations")
      .update({ status: "pending", updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    return { operationId: existing.id, completedLink: null, executor: true };
  }

  const { data: inserted, error } = await ctx.supabase
    .from("stripe_payment_link_operations")
    .insert({
      organization_id: ctx.organizationId,
      request_id: requestId,
      payload_hash: payloadHash,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !inserted) {
    throw new Error("Falha ao registrar operação de criação.");
  }
  return { operationId: inserted.id, completedLink: null, executor: true };
}

export async function completePaymentOperation(
  ctx: Context,
  operationId: string,
  resourceIds: PaymentResourceIds,
  input: PaymentLinkAction
): Promise<PaymentLink> {
  const { data: linkRow, error: linkErr } = await ctx.supabase
    .from("stripe_payment_links")
    .insert({
      organization_id: ctx.organizationId,
      client_id: input.clientId || null,
      deal_id: input.dealId || null,
      stripe_payment_link_id: resourceIds.linkId,
      stripe_price_id: resourceIds.priceId,
      stripe_product_id: resourceIds.productId,
      url: resourceIds.url,
      kind: input.kind,
      status: "active",
      amount_cents: input.amountCents,
      currency: input.currency,
      recurring_interval: input.recurringInterval || null,
      installments: 1,
      description: input.description.trim(),
      created_by: ctx.userId,
      request_id: input.requestId || null,
    })
    .select("*")
    .single();

  if (linkErr || !linkRow) {
    throw new Error("Payment Link criado no Stripe, mas falhou ao persistir.");
  }

  await ctx.supabase
    .from("stripe_payment_link_operations")
    .update({
      status: "completed",
      payment_link_id: linkRow.id,
      resource_ids: resourceIds,
      updated_at: new Date().toISOString(),
    })
    .eq("id", operationId);

  return map(linkRow as Record<string, unknown>);
}

export async function failPaymentOperation(
  ctx: Context,
  operationId: string,
  errorCode: string
): Promise<void> {
  await ctx.supabase
    .from("stripe_payment_link_operations")
    .update({
      status: "failed",
      error_code: errorCode,
      updated_at: new Date().toISOString(),
    })
    .eq("id", operationId);
}
