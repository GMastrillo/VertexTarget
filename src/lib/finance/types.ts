export type BaseCurrency = "brl" | "usd" | "eur";

export type Money = {
  amountMinor: number;
  currency: string;
};

export type ParseAmountResult =
  | { ok: true; amountMinor: number }
  | { ok: false; code: "format" | "range" };

export type FinanceInvoice = {
  id: string;
  organizationId: string;
  currency: string;
  amountPaidMinor: number;
  amountRemainingMinor: number;
  paidAt: string | null;
  status: string;
};

export type FinanceSubscriptionItem = {
  currency: string;
  unitAmountMinor: number | null;
  quantity: number;
  interval: "month" | "year" | "week" | "day";
  intervalCount: number;
};

export type FinanceCurrencyGroup = {
  currency: string;
  mrrMinor: number;
  grossThisMonthMinor: number;
  overdueMinor: number;
  manualThisMonthMinor: number;
  manualTotalMinor: number;
  revenue: { monthKey: string; amountMinor: number }[];
  mrrCoverage: "complete" | "unsupported_interval";
};

export type FinanceData = {
  groups: FinanceCurrencyGroup[];
  transactions: {
    id: string;
    client: string;
    method: string;
    paidAt: string;
    money: Money;
    status: string;
  }[];
  coverage: {
    stripe: "complete" | "unconfigured" | "error";
    manual: "complete" | "error";
    errorCode?: string;
  };
};

export type FinanceSources = {
  invoices: FinanceInvoice[];
  subscriptionItems: FinanceSubscriptionItem[];
  manualSales: { amountMinor: number; soldAt: string }[];
  coverage: FinanceData["coverage"];
};
