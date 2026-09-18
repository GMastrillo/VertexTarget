import "server-only";
import Stripe from "stripe";
import { revenue as mockRevenue, transactions as mockTransactions } from "@/lib/admin-data";

export type FinanceData = {
  mrr: number;
  grossThisMonth: number;
  overdue: number;
  activeCustomers: number;
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
  const stripe = getStripeClient();
  if (!stripe) {
    return { mrr: 42600, grossThisMonth: 64200, overdue: 2180, activeCustomers: 12, revenue: mockRevenue, transactions: mockTransactions, source: "mock" };
  }

  const now = new Date();
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
  const revenue = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    const value = historicalInvoices.data.reduce((total, invoice) => {
      const created = new Date(invoice.created * 1000);
      return created.getFullYear() === year && created.getMonth() === month ? total + (invoice.amount_paid ?? 0) : total;
    }, 0);
    return { month: date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""), value };
  });
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

  return { mrr, grossThisMonth, overdue, activeCustomers: customers.data.length, revenue, transactions, source: "stripe" };
}
