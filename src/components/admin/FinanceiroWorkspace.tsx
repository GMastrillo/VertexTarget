"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  KpiCard,
  PageHeader,
  RevenueChart,
  SectionTitle,
  StatusBadge,
} from "./AdminUI";
import { ManualSales, type ManualSaleItem } from "./ManualSales";
import { PaymentLinks } from "./PaymentLinks";
import { formatMoney } from "@/lib/finance/money";
import type { FinanceData } from "@/lib/finance/types";
import type { PaymentLink } from "@/lib/payment-link-types";

type Props = {
  finance: FinanceData;
  manualSales: ManualSaleItem[];
  canManage: boolean;
  paymentLinkData: { links: PaymentLink[]; error: string };
  clients: { id: string; name: string }[];
  deals: { id: string; name: string }[];
};

type SelectedGroup = FinanceData["groups"][number];

function FinanceiroKpis({
  group,
  curr,
  grossThisMonth,
}: {
  group: SelectedGroup;
  curr: string;
  grossThisMonth: number;
}) {
  const mrrDisplay = formatMoney({ amountMinor: group.mrrMinor, currency: curr }, "pt-BR");
  const grossDisplay = formatMoney({ amountMinor: grossThisMonth, currency: curr }, "pt-BR");
  const stripeGross = formatMoney({ amountMinor: group.grossThisMonthMinor, currency: curr }, "pt-BR");
  const overdueDisplay = formatMoney({ amountMinor: group.overdueMinor, currency: curr }, "pt-BR");

  const grossChange = group.manualThisMonthMinor > 0
    ? `Stripe ${stripeGross} + manual ${formatMoney({ amountMinor: group.manualThisMonthMinor, currency: curr }, "pt-BR")}`
    : `Stripe ${stripeGross}`;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label={`MRR (${curr.toUpperCase()})`}
        value={mrrDisplay}
        change={group.mrrCoverage === "unsupported_interval" ? "Parcial (intervalos não mensais)" : "Assinaturas"}
        icon="revenue"
      />
      <KpiCard
        label={`Faturamento do mês (${curr.toUpperCase()})`}
        value={grossDisplay}
        change={grossChange}
        icon="card"
        accent="violet"
      />
      <KpiCard
        label={`Inadimplência (${curr.toUpperCase()})`}
        value={overdueDisplay}
        change="Em aberto"
        icon="alert"
        accent="orange"
      />
      <KpiCard
        label="Cobertura de dados"
        value={curr.toUpperCase()}
        change={group.mrrCoverage === "complete" ? "Métricas completas" : "Atenção: intervalos custom"}
        icon="users"
        accent="green"
      />
    </div>
  );
}

function FinanceiroSummary({
  group,
  curr,
  grossThisMonth,
}: {
  group: SelectedGroup;
  curr: string;
  grossThisMonth: number;
}) {
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-muted-foreground">Receita recorrente</span>
          <strong>{formatMoney({ amountMinor: group.mrrMinor, currency: curr }, "pt-BR")}</strong>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary"
            style={{ width: `${Math.min(group.mrrMinor ? 100 : 0, 100)}%` }}
          />
        </div>
      </div>
      <div>
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-muted-foreground">Faturamento do mês</span>
          <strong>{formatMoney({ amountMinor: grossThisMonth, currency: curr }, "pt-BR")}</strong>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500"
            style={{ width: `${Math.min(grossThisMonth ? 100 : 0, 100)}%` }}
          />
        </div>
      </div>
      {group.manualTotalMinor > 0 && (
        <div className="border-t border-border pt-5">
          <p className="text-xs text-muted-foreground">Vendas manuais acumuladas (BRL)</p>
          <p className="mt-1 text-2xl font-semibold text-success">
            {formatMoney({ amountMinor: group.manualTotalMinor, currency: "brl" }, "pt-BR")}
          </p>
        </div>
      )}
    </div>
  );
}

function FinanceiroTransactions({
  transactions,
  sourceLabel,
}: {
  transactions: FinanceData["transactions"];
  sourceLabel: string;
}) {
  return (
    <div className="admin-card mt-6">
      <SectionTitle title="Últimas transações · Stripe" meta={sourceLabel} />
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Descrição</th>
              <th>Data</th>
              <th>Status</th>
              <th className="text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-[10px] font-semibold text-primary">
                      {tx.client.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{tx.client}</p>
                      <p className="text-[10px] text-muted-foreground">{tx.id}</p>
                    </div>
                  </div>
                </td>
                <td>{tx.method}</td>
                <td>{new Date(tx.paidAt).toLocaleDateString("pt-BR")}</td>
                <td>
                  <StatusBadge status={tx.status} />
                </td>
                <td className="text-right font-medium text-foreground">
                  {formatMoney(tx.money, "pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!transactions.length && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhuma transação Stripe encontrada.
        </p>
      )}
    </div>
  );
}

function getSourceStatus(coverage: FinanceData["coverage"]): { label: string; tone: "success" | "warn" | "error" } {
  if (coverage.stripe === "complete") return { label: "Stripe conectado", tone: "success" };
  if (coverage.stripe === "error") return { label: `Stripe: erro (${coverage.errorCode ?? "falha"})`, tone: "error" };
  return { label: "Stripe não configurado", tone: "warn" };
}

export function FinanceiroWorkspace({
  finance,
  manualSales,
  canManage,
  paymentLinkData,
  clients,
  deals,
}: Props) {
  const groups = finance.groups.length > 0
    ? finance.groups
    : [{
        currency: "brl",
        mrrMinor: 0,
        grossThisMonthMinor: 0,
        overdueMinor: 0,
        manualThisMonthMinor: 0,
        manualTotalMinor: 0,
        revenue: [],
        mrrCoverage: "complete" as const,
      }];

  const [activeCurrency, setActiveCurrency] = useState<string>(groups[0].currency);
  const selectedGroup = groups.find((g) => g.currency.toLowerCase() === activeCurrency.toLowerCase()) ?? groups[0];
  const curr = selectedGroup.currency.toLowerCase();
  const grossThisMonth = selectedGroup.grossThisMonthMinor + selectedGroup.manualThisMonthMinor;
  const status = getSourceStatus(finance.coverage);
  const chartData = selectedGroup.revenue.map((r) => ({ month: r.monthKey, value: r.amountMinor }));

  return (
    <div>
      <PageHeader
        eyebrow="Financeiro / Multi-moeda & Vendas"
        title="Visão financeira"
        description="Receita isolada por moeda: faturas e assinaturas Stripe somadas às vendas manuais de cada mercado, sem consolidação falsa."
        action={
          <span className="admin-secondary-btn">
            <span className={status.tone === "success" ? "text-success" : status.tone === "error" ? "text-destructive" : "text-warning"}>
              ●
            </span>{" "}
            {status.label} <ArrowUpRight size={16} />
          </span>
        }
      />

      {groups.length > 1 && (
        <div className="mb-6 flex items-center gap-2 border-b border-border pb-3">
          <span className="text-xs font-medium text-muted-foreground mr-2">Moeda ativa:</span>
          {groups.map((g) => (
            <button
              key={g.currency}
              onClick={() => setActiveCurrency(g.currency)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeCurrency.toLowerCase() === g.currency.toLowerCase()
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-muted text-muted-foreground hover:bg-accent/20 hover:text-foreground"
              }`}
            >
              {g.currency.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <FinanceiroKpis group={selectedGroup} curr={curr} grossThisMonth={grossThisMonth} />

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="admin-card">
          <SectionTitle
            title={`Crescimento do faturamento (${curr.toUpperCase()})`}
            meta="Últimos 6 meses · Sem mistura de moedas"
          />
          <RevenueChart data={chartData} currency={curr} />
        </div>
        <div className="admin-card">
          <SectionTitle title={`Resumo do mês (${curr.toUpperCase()})`} meta="Dados server-side" />
          <FinanceiroSummary group={selectedGroup} curr={curr} grossThisMonth={grossThisMonth} />
        </div>
      </div>

      <div className="admin-card mt-6">
        <ManualSales initialSales={manualSales} canManage={canManage} />
      </div>

      <div className="admin-card mt-6">
        {paymentLinkData.error ? (
          <p role="alert" className="rounded-lg border border-warning/20 bg-warning/5 p-3 text-xs text-warning">
            {paymentLinkData.error}
          </p>
        ) : (
          <PaymentLinks initialLinks={paymentLinkData.links} clients={clients} deals={deals} canManage={canManage} />
        )}
      </div>

      <FinanceiroTransactions transactions={finance.transactions} sourceLabel={status.label} />
    </div>
  );
}
