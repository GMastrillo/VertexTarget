import type { BaseCurrency } from "./types.ts";

export type PaymentCapabilities = {
  readonly baseCurrencies: readonly BaseCurrency[];
  readonly installmentsAllowed: false;
};

export const PAYMENT_CAPABILITIES: PaymentCapabilities = {
  baseCurrencies: ["brl", "usd", "eur"],
  installmentsAllowed: false,
};
