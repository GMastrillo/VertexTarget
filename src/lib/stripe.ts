/* eslint-disable max-statements -- finance aggregation keeps Stripe and manual sources synchronized. */
import "server-only";
import Stripe from "stripe";

export type FinanceData = {
  mrr: number;
  grossThisMonth: number;
  overdue: number;
  activeCustomers: number;
  manualTotalCents: number;
  manualThisMonthCents: number;
  revenue: { month: string; value: number }[];
  transactions: { id: string; client: string; method: string; date: string; value: string; status: string }[];
  source: "stripe" | "mock";
};

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  return secretKey ? new Stripe(secretKey) : null;
}

const brl = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

export async function getFinanceData(): Promise<FinanceData> {
  const manual = await getManualSalesData();
  const now = new Date();
  // Shared 6-month buckets (labels + YYYY-MM keys) used by both data sources.
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    return {
      label: date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    };
  });

  const stripe = getStripeClient();
  if (!stripe) {
    // No Stripe key: real manual sales still flow through; Stripe columns stay zero (no fake demo data).
    return {
      mrr: 0, grossThisMonth: 0, overdue: 0, activeCustomers: 0,
      manualTotalCents: manual.totalCents,
      manualThisMonthCents: manual.thisMonthCents,
      revenue: months.map((m) => ({ month: m.label, value: manual.monthly[m.key] ?? 0 })),
      transactions: [],
      source: "mock",
    };
  }

  const monthStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthStart = Math.floor(monthStartDate.getTime() / 1000);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const sixMonthsStart = Math.floor(sixMonthsAgo.getTime() / 1000);
  const [subscriptions, paidInvoices, historicalInvoices, openInvoices, customers] = await Promise.all([
    stripe.subscriptions.list({ status: "active", limit: 100, expand: ["data.items.data.price"] }),
    stripe.invoices.list({ status: "paid", created: { gte: monthStart }, limit: 100, expand: ["data.customer"] }),
    stripe.invoices.list({ status: "paid", created: { gte: sixMonthsStart }, limit: 100 }),
    stripe.invoices.list({ status: "open", limit: 100 }),
    stripe.customers.list({ limit: 100 }),
  ]);

  const mrr = subscriptions.data.reduce((total, subscription) => total + subscription.items.data.reduce((sum, item) => {
    const price = item.price;
    const quantity = item.quantity ?? 1;
    if (price.recurring?.interval === "year") return sum + Math.round((price.unit_amount ?? 0) * quantity / 12);
    return sum + (price.unit_amount ?? 0) * quantity;
  }, 0), 0);
  const grossThisMonth = paidInvoices.data.reduce((total, invoice) => total + (invoice.amount_paid ?? 0), 0);
  const overdue = openInvoices.data.reduce((total, invoice) => total + (invoice.amount_remaining ?? 0), 0);

  // Stripe revenue grouped by YYYY-MM bucket (local calendar).
  const stripeMonthly: Record<string, number> = {};
  for (const invoice of historicalInvoices.data) {
    const created = new Date(invoice.created * 1000);
    const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}`;
    stripeMonthly[key] = (stripeMonthly[key] ?? 0) + (invoice.amount_paid ?? 0);
  }
  // Chart = Stripe + manual (PIX/cash/transfer) per month.
  const revenue = months.map((m) => ({ month: m.label, value: (stripeMonthly[m.key] ?? 0) + (manual.monthly[m.key] ?? 0) }));
  const transactions = paidInvoices.data.slice(0, 8).map((invoice) => ({
    id: invoice.number ?? invoice.id,
    client: typeof invoice.customer === "object" && invoice.customer && !("deleted" in invoice.customer)
      ? invoice.customer.name ?? invoice.customer.email ?? "Cliente Stripe"
      : "Cliente Stripe",
    method: invoice.description ?? "Fatura Stripe",
    date: new Date((invoice.status_transitions.paid_at ?? invoice.created) * 1000).toLocaleDateString("pt-BR"),
    value: brl(invoice.amount_paid ?? 0),
    status: "Pago",
  }));

  return { mrr, grossThisMonth, overdue, activeCustomers: customers.data.length, manualTotalCents: manual.totalCents, manualThisMonthCents: manual.thisMonthCents, revenue, transactions, source: "stripe" };
}

// Manual (PIX/cash/transfer) sales from Supabase — always real data.
// Returns totals plus per-month buckets (YYYY-MM → cents) for the chart.
async function getManualSalesData(): Promise<{ totalCents: number; thisMonthCents: number; monthly: Record<string, number> }> {
  try {
    const { createSupabaseServerClient } = await import("@/lib/supabase-server");
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { totalCents: 0, thisMonthCents: 0, monthly: {} };
    const { data } = await supabase.from("manual_sales").select("amount_cents,sold_at").order("sold_at", { ascending: false }).limit(500);
    const rows = data ?? [];
    const thisMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
    const monthly: Record<string, number> = {};
    let totalCents = 0;
    let thisMonthCents = 0;
    for (const row of rows) {
      const cents = Number(row.amount_cents ?? 0);
      totalCents += cents;
      // sold_at is a calendar date (YYYY-MM-DD); bucket it on the local calendar.
      const date = new Date(String(row.sold_at) + "T00:00:00");
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthly[key] = (monthly[key] ?? 0) + cents;
      if (key === thisMonthKey) thisMonthCents += cents;
    }
    return { totalCents, thisMonthCents, monthly };
  } catch {
    return { totalCents: 0, thisMonthCents: 0, monthly: {} };
  }
}
