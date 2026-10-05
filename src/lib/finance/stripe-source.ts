import type {
  FinanceInvoice,
  FinanceSubscriptionItem,
  Money,
} from "./types.ts";

export type StripeTransactionItem = {
  id: string;
  client: string;
  method: string;
  paidAt: string;
  money: Money;
  status: string;
};

export type StripeSourceResult = {
  invoices: FinanceInvoice[];
  subscriptionItems: FinanceSubscriptionItem[];
  transactions: StripeTransactionItem[];
  coverage: "complete" | "unconfigured" | "error";
  errorCode?: string;
};

type MinimalStripeClient = {
  subscriptions: {
    list: (params: Record<string, unknown>) => Promise<{
      has_more?: boolean;
      data: Array<{
        id: string;
        metadata?: Record<string, unknown>;
        items?: {
          data?: Array<{
            price?: {
              unit_amount?: number | null;
              currency?: string;
              recurring?: {
                interval?: "month" | "year" | "week" | "day";
                interval_count?: number;
              };
              metadata?: Record<string, unknown>;
            };
            quantity?: number;
          }>;
        };
      }>;
    }>;
  };
  invoices: {
    list: (params: Record<string, unknown>) => Promise<{
      has_more?: boolean;
      data: Array<{
        id: string;
        number?: string | null;
        customer?: unknown;
        currency?: string;
        amount_paid?: number | null;
        amount_remaining?: number | null;
        status?: string | null;
        description?: string | null;
        created?: number;
        status_transitions?: { paid_at?: number | null };
        metadata?: Record<string, unknown>;
        subscription_details?: { metadata?: Record<string, unknown> };
      }>;
    }>;
  };
};

function matchesOrg(metadata: Record<string, unknown> | undefined, orgId: string): boolean {
  return metadata?.organization_id === orgId;
}

function parseClientName(customer: unknown): string {
  if (customer && typeof customer === "object" && !("deleted" in customer)) {
    const c = customer as { name?: string | null; email?: string | null };
    return c.name ?? c.email ?? "Cliente Stripe";
  }
  return "Cliente Stripe";
}

type SubData = {
  id: string;
  metadata?: Record<string, unknown>;
  items?: {
    data?: Array<{
      price?: {
        unit_amount?: number | null;
        currency?: string;
        recurring?: {
          interval?: "month" | "year" | "week" | "day";
          interval_count?: number;
        };
        metadata?: Record<string, unknown>;
      };
      quantity?: number;
    }>;
  };
};

type SubDataItem = {
  price?: {
    unit_amount?: number | null;
    currency?: string;
    recurring?: {
      interval?: "month" | "year" | "week" | "day";
      interval_count?: number;
    };
    metadata?: Record<string, unknown>;
  };
  quantity?: number;
};

function extractSubItem(it: SubDataItem): FinanceSubscriptionItem | null {
  const p = it.price;
  if (!p || !p.currency) return null;
  return {
    currency: p.currency,
    unitAmountMinor: p.unit_amount ?? null,
    quantity: it.quantity ?? 1,
    interval: p.recurring?.interval ?? "month",
    intervalCount: p.recurring?.interval_count ?? 1,
  };
}

function extractSubItems(sub: SubData, orgId: string): FinanceSubscriptionItem[] {
  if (!matchesOrg(sub.metadata, orgId)) return [];
  const items: FinanceSubscriptionItem[] = [];
  const subItems = sub.items?.data ?? [];
  for (const it of subItems) {
    const item = extractSubItem(it);
    if (item) items.push(item);
  }
  return items;
}

async function fetchAllSubscriptions(
  stripe: MinimalStripeClient,
  orgId: string
): Promise<FinanceSubscriptionItem[]> {
  const items: FinanceSubscriptionItem[] = [];
  let startingAfter: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const res = await stripe.subscriptions.list({
      status: "active",
      limit: 100,
      expand: ["data.items.data.price"],
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });
    for (const sub of res.data) {
      items.push(...extractSubItems(sub, orgId));
    }
    hasMore = Boolean(res.has_more && res.data.length > 0);
    if (hasMore) {
      startingAfter = res.data[res.data.length - 1].id;
    }
  }
  return items;
}

function buildTransaction(
  inv: {
    id: string;
    number?: string | null;
    customer?: unknown;
    description?: string | null;
    currency?: string;
    amount_paid?: number | null;
    created?: number;
    status_transitions?: { paid_at?: number | null };
  },
  paidAtIso: string
): StripeTransactionItem {
  return {
    id: inv.number ?? inv.id,
    client: parseClientName(inv.customer),
    method: inv.description ?? "Fatura Stripe",
    paidAt: paidAtIso,
    money: {
      amountMinor: inv.amount_paid ?? 0,
      currency: (inv.currency ?? "brl").toLowerCase(),
    },
    status: "Pago",
  };
}

type InvData = {
  id: string;
  number?: string | null;
  customer?: unknown;
  currency?: string;
  amount_paid?: number | null;
  amount_remaining?: number | null;
  status?: string | null;
  description?: string | null;
  created?: number;
  status_transitions?: { paid_at?: number | null };
  metadata?: Record<string, unknown>;
  subscription_details?: { metadata?: Record<string, unknown> };
};

function parseInvoiceItem(
  inv: InvData,
  orgId: string
): { invoice: FinanceInvoice; tx: StripeTransactionItem | null } | null {
  const orgMatch =
    matchesOrg(inv.metadata, orgId) ||
    matchesOrg(inv.subscription_details?.metadata, orgId);
  if (!orgMatch) return null;

  const paidSeconds = inv.status_transitions?.paid_at ?? null;
  const paidAtIso = paidSeconds ? new Date(paidSeconds * 1000).toISOString() : null;

  const invoice: FinanceInvoice = {
    id: inv.id,
    organizationId: orgId,
    currency: (inv.currency ?? "brl").toLowerCase(),
    amountPaidMinor: inv.amount_paid ?? 0,
    amountRemainingMinor: inv.amount_remaining ?? 0,
    paidAt: paidAtIso,
    status: inv.status ?? "open",
  };

  const tx = paidAtIso ? buildTransaction(inv, paidAtIso) : null;
  return { invoice, tx };
}

async function fetchAllInvoices(
  stripe: MinimalStripeClient,
  orgId: string
): Promise<{ invoices: FinanceInvoice[]; transactions: StripeTransactionItem[] }> {
  const invoices: FinanceInvoice[] = [];
  const transactions: StripeTransactionItem[] = [];
  let startingAfter: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const res = await stripe.invoices.list({
      limit: 100,
      expand: ["data.customer"],
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });
    for (const inv of res.data) {
      const parsed = parseInvoiceItem(inv, orgId);
      if (!parsed) continue;
      invoices.push(parsed.invoice);
      if (parsed.tx && transactions.length < 15) {
        transactions.push(parsed.tx);
      }
    }
    hasMore = Boolean(res.has_more && res.data.length > 0);
    if (hasMore) {
      startingAfter = res.data[res.data.length - 1].id;
    }
  }
  return { invoices, transactions };
}

export async function fetchStripeSource(input: {
  stripe: unknown;
  organizationId: string;
  now: Date;
}): Promise<StripeSourceResult> {
  if (!input.stripe) {
    return {
      invoices: [],
      subscriptionItems: [],
      transactions: [],
      coverage: "unconfigured",
    };
  }

  try {
    const client = input.stripe as MinimalStripeClient;
    const [subItems, invData] = await Promise.all([
      fetchAllSubscriptions(client, input.organizationId),
      fetchAllInvoices(client, input.organizationId),
    ]);

    return {
      invoices: invData.invoices,
      subscriptionItems: subItems,
      transactions: invData.transactions,
      coverage: "complete",
    };
  } catch (err) {
    const errorObj = err as { code?: string; message?: string };
    return {
      invoices: [],
      subscriptionItems: [],
      transactions: [],
      coverage: "error",
      errorCode: errorObj.code ?? errorObj.message ?? "stripe_error",
    };
  }
}
