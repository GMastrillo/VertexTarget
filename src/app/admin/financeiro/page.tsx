import { ArrowUpRight } from "lucide-react";
import { KpiCard, PageHeader, RevenueChart, SectionTitle, StatusBadge } from "@/components/admin/AdminUI";
import { ManualSales, type ManualSaleItem } from "@/components/admin/ManualSales";
import { getAuthenticatedTeamUser } from "@/lib/auth";
import { listManualSales } from "@/lib/operations-repository";
import { getClients } from "@/lib/admin-repository";
import { getCommercialSnapshot } from "@/lib/commercial-repository";
import { getPaymentLinksData } from "@/lib/payment-link-repository";
import { PaymentLinks } from "@/components/admin/PaymentLinks";
import { getFinanceData } from "@/lib/stripe";

const brl = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

export const dynamic = "force-dynamic";

export default async function FinanceiroPage() {
  const [finance, manualSales, user, paymentLinkData, clients, commercial] = await Promise.all([getFinanceData(), listManualSales(), getAuthenticatedTeamUser(), getPaymentLinksData(), getClients(), getCommercialSnapshot()]);
  const canManage = user?.role === "owner" || user?.role === "finance";

  // Manual sales in the current month complement the Stripe gross revenue.
  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const manualThisMonth = manualSales
    .filter((sale: ManualSaleItem) => sale.soldAt.startsWith(monthPrefix))
    .reduce((sum, sale) => sum + sale.amountCents, 0);

  const grossTotal = finance.grossThisMonth + manualThisMonth;
  const sourceLabel = finance.source === "stripe" ? "Stripe conectado" : "Stripe não configurado";
  const manualTotal = manualSales.reduce((sum, s) => sum + s.amountCents, 0);

  return <div>
    <PageHeader eyebrow="Financeiro / Stripe + vendas manuais" title="Visão financeira" description="Receita consolidada: assinaturas e faturas do Stripe somadas às vendas registradas manualmente (PIX, dinheiro, transferência)." action={<span className="admin-secondary-btn"><span className={finance.source === "stripe" ? "text-emerald-300" : "text-amber-300"}>●</span> {sourceLabel} <ArrowUpRight size={16} /></span>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard label="MRR (Stripe)" value={brl(finance.mrr)} change="Assinaturas" icon="revenue" />
      <KpiCard label="Faturamento do mês" value={brl(grossTotal)} change={`Stripe ${brl(finance.grossThisMonth)} + manual ${brl(manualThisMonth)}`} icon="card" accent="violet" />
      <KpiCard label="Inadimplência" value={brl(finance.overdue)} change="Em aberto" icon="alert" accent="orange" />
      <KpiCard label="Clientes ativos" value={String(finance.activeCustomers)} change="Stripe" icon="users" accent="green" />
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <div className="admin-card"><SectionTitle title="Crescimento do faturamento" meta="Últimos 6 meses · Stripe" /><RevenueChart data={finance.revenue} /></div>
      <div className="admin-card"><SectionTitle title="Resumo do mês" meta="Dados server-side" /><div className="space-y-5"><div><div className="mb-2 flex justify-between text-sm"><span className="text-slate-400">Receita recorrente (Stripe)</span><strong>{brl(finance.mrr)}</strong></div><div className="h-2 overflow-hidden rounded-full bg-white/[.06]"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-500" style={{ width: `${Math.min(finance.mrr ? 100 : 0, 100)}%` }} /></div></div><div><div className="mb-2 flex justify-between text-sm"><span className="text-slate-400">Faturamento do mês (total)</span><strong>{brl(grossTotal)}</strong></div><div className="h-2 overflow-hidden rounded-full bg-white/[.06]"><div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500" style={{ width: `${Math.min(grossTotal ? 100 : 0, 100)}%` }} /></div></div><div className="border-t border-white/[.06] pt-5"><p className="text-xs text-slate-500">Vendas manuais acumuladas</p><p className="mt-1 text-2xl font-semibold text-emerald-300">{brl(manualTotal)}</p></div></div></div>
    </div>
    <div className="admin-card mt-6"><ManualSales initialSales={manualSales} canManage={canManage} /></div>
    <div className="admin-card mt-6"><PaymentLinks initialLinks={paymentLinkData.links} initialError={paymentLinkData.error} clients={clients.map((client) => ({ id: client.id, name: client.name }))} deals={commercial.deals.map((deal) => ({ id: deal.id, name: deal.title }))} canManage={canManage} /></div>
    <div className="admin-card mt-6"><SectionTitle title="Últimas transações · Stripe" meta={sourceLabel} /><div className="overflow-x-auto"><table className="admin-table"><thead><tr><th>Cliente</th><th>Descrição</th><th>Data</th><th>Status</th><th className="text-right">Valor</th></tr></thead><tbody>{finance.transactions.map((transaction) => <tr key={transaction.id}><td><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400/10 text-[10px] font-semibold text-cyan-300">{transaction.client.slice(0, 2).toUpperCase()}</span><div><p className="font-medium text-slate-200">{transaction.client}</p><p className="text-[10px] text-slate-600">{transaction.id}</p></div></div></td><td>{transaction.method}</td><td>{transaction.date}</td><td><StatusBadge status={transaction.status} /></td><td className="text-right font-medium text-slate-200">{transaction.value}</td></tr>)}</tbody></table></div>{!finance.transactions.length && <p className="py-8 text-center text-sm text-slate-500">Nenhuma transação Stripe encontrada.</p>}</div>
  </div>;
}
