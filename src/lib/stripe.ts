import "server-only";
import Stripe from "stripe";
import { getFinanceData, loadFinanceSources } from "./finance/repository.ts";
import type {
  FinanceCurrencyGroup,
  FinanceData,
  FinanceSources,
} from "./finance/types.ts";

export { getFinanceData, loadFinanceSources };
export type { FinanceCurrencyGroup, FinanceData, FinanceSources };

export function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  return secretKey ? new Stripe(secretKey) : null;
}
