import type {
  FinanceCurrencyGroup,
  FinanceInvoice,
  FinanceSubscriptionItem,
} from "./types.ts";

function getSixMonthKeys(now: Date, timeZone: string): string[] {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);
  const curYear = Number.parseInt(parts.find((p) => p.type === "year")?.value ?? "2026", 10);
  const curMonth = Number.parseInt(parts.find((p) => p.type === "month")?.value ?? "1", 10);

  const keys: string[] = [];
  for (let i = 5; i >= 0; i--) {
    let m = curMonth - i;
    let y = curYear;
    while (m <= 0) {
      m += 12;
      y -= 1;
    }
    keys.push(`${y}-${String(m).padStart(2, "0")}`);
  }
  return keys;
}

function getYearMonthFromIso(iso: string, timeZone: string): string {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  return `${y}-${m}`;
}

type GroupAccumulator = {
  currency: string;
  mrrMinor: number;
  grossThisMonthMinor: number;
  overdueMinor: number;
  manualThisMonthMinor: number;
  manualTotalMinor: number;
  revenueByMonth: Map<string, number>;
  mrrCoverage: "complete" | "unsupported_interval";
};

function createGroupAcc(currency: string, monthKeys: readonly string[]): GroupAccumulator {
  const revenueByMonth = new Map<string, number>();
  for (const key of monthKeys) {
    revenueByMonth.set(key, 0);
  }
  return {
    currency,
    mrrMinor: 0,
    grossThisMonthMinor: 0,
    overdueMinor: 0,
    manualThisMonthMinor: 0,
    manualTotalMinor: 0,
    revenueByMonth,
    mrrCoverage: "complete",
  };
}

function processSubscriptionItem(item: FinanceSubscriptionItem, acc: GroupAccumulator): void {
  if (item.unitAmountMinor == null || item.interval === "week" || item.interval === "day") {
    acc.mrrCoverage = "unsupported_interval";
    return;
  }
  const count = Math.max(1, item.intervalCount);
  const qty = Math.max(1, item.quantity);
  const totalItemMinor = item.unitAmountMinor * qty;
  if (item.interval === "year") {
    acc.mrrMinor += Math.round(totalItemMinor / (12 * count));
  } else {
    acc.mrrMinor += Math.round(totalItemMinor / count);
  }
}

type ProcessInvoicesParams = {
  invoices: readonly FinanceInvoice[];
  groupMap: Map<string, GroupAccumulator>;
  monthKeys: readonly string[];
  currentMonthKey: string;
  timeZone: string;
};

function processInvoices(params: ProcessInvoicesParams): void {
  for (const inv of params.invoices) {
    const cur = inv.currency.toLowerCase();
    let acc = params.groupMap.get(cur);
    if (!acc) {
      acc = createGroupAcc(cur, params.monthKeys);
      params.groupMap.set(cur, acc);
    }
    if (inv.paidAt) {
      const monthKey = getYearMonthFromIso(inv.paidAt, params.timeZone);
      if (monthKey === params.currentMonthKey) {
        acc.grossThisMonthMinor += inv.amountPaidMinor;
      }
      if (acc.revenueByMonth.has(monthKey)) {
        const curAmount = acc.revenueByMonth.get(monthKey) ?? 0;
        acc.revenueByMonth.set(monthKey, curAmount + inv.amountPaidMinor);
      }
    }
    if (inv.status === "open" || inv.amountRemainingMinor > 0) {
      acc.overdueMinor += inv.amountRemainingMinor;
    }
  }
}

function processManualSales(
  manualSales: readonly { amountMinor: number; soldAt: string }[],
  groupMap: Map<string, GroupAccumulator>,
  monthKeys: readonly string[],
  currentMonthKey: string
): void {
  if (manualSales.length === 0) return;
  let brlAcc = groupMap.get("brl");
  if (!brlAcc) {
    brlAcc = createGroupAcc("brl", monthKeys);
    groupMap.set("brl", brlAcc);
  }
  for (const sale of manualSales) {
    brlAcc.manualTotalMinor += sale.amountMinor;
    const saleMonthKey = sale.soldAt.slice(0, 7);
    if (saleMonthKey === currentMonthKey) {
      brlAcc.manualThisMonthMinor += sale.amountMinor;
    }
    if (brlAcc.revenueByMonth.has(saleMonthKey)) {
      const curAmount = brlAcc.revenueByMonth.get(saleMonthKey) ?? 0;
      brlAcc.revenueByMonth.set(saleMonthKey, curAmount + sale.amountMinor);
    }
  }
}

export function aggregateFinance(input: {
  invoices: readonly FinanceInvoice[];
  subscriptionItems: readonly FinanceSubscriptionItem[];
  manualSales: readonly { amountMinor: number; soldAt: string }[];
  now: Date;
  timeZone: string;
}): FinanceCurrencyGroup[] {
  const monthKeys = getSixMonthKeys(input.now, input.timeZone);
  const currentMonthKey = monthKeys[monthKeys.length - 1];
  const groupMap = new Map<string, GroupAccumulator>();

  for (const item of input.subscriptionItems) {
    const cur = item.currency.toLowerCase();
    let acc = groupMap.get(cur);
    if (!acc) {
      acc = createGroupAcc(cur, monthKeys);
      groupMap.set(cur, acc);
    }
    processSubscriptionItem(item, acc);
  }

  processInvoices({
    invoices: input.invoices,
    groupMap,
    monthKeys,
    currentMonthKey,
    timeZone: input.timeZone,
  });
  processManualSales(input.manualSales, groupMap, monthKeys, currentMonthKey);

  const groups: FinanceCurrencyGroup[] = [];
  for (const acc of groupMap.values()) {
    const revenue = monthKeys.map((key) => ({
      monthKey: key,
      amountMinor: acc.revenueByMonth.get(key) ?? 0,
    }));
    groups.push({
      currency: acc.currency,
      mrrMinor: acc.mrrMinor,
      grossThisMonthMinor: acc.grossThisMonthMinor,
      overdueMinor: acc.overdueMinor,
      manualThisMonthMinor: acc.manualThisMonthMinor,
      manualTotalMinor: acc.manualTotalMinor,
      revenue,
      mrrCoverage: acc.mrrCoverage,
    });
  }

  return groups.sort((a, b) => a.currency.localeCompare(b.currency));
}
