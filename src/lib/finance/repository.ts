import "server-only";
import { getAuthenticatedTeamUser } from "../auth.ts";
import { createSupabaseServerClient } from "../supabase-server.ts";
import { getStripeClient } from "../stripe.ts";
import { aggregateFinance } from "./aggregate.ts";
import { fetchManualSource } from "./manual-source.ts";
import { fetchStripeSource } from "./stripe-source.ts";
import type { FinanceData, FinanceSources } from "./types.ts";

export async function loadFinanceSources(
  context: { organizationId: string; userId: string },
  now: Date
): Promise<FinanceSources> {
  const stripe = getStripeClient();
  const supabase = await createSupabaseServerClient();

  const [stripeResult, manualResult] = await Promise.all([
    fetchStripeSource({
      stripe,
      organizationId: context.organizationId,
      now,
    }),
    fetchManualSource({
      supabase,
      organizationId: context.organizationId,
    }),
  ]);

  return {
    invoices: stripeResult.invoices,
    subscriptionItems: stripeResult.subscriptionItems,
    manualSales: manualResult.manualSales,
    coverage: {
      stripe: stripeResult.coverage,
      manual: manualResult.coverage,
      errorCode: stripeResult.errorCode ?? manualResult.errorCode,
    },
  };
}

export async function getFinanceData(options?: {
  organizationId?: string;
  timeZone?: string;
}): Promise<FinanceData> {
  const user = await getAuthenticatedTeamUser();
  const organizationId = options?.organizationId ?? user?.organizationId;
  const timeZone = options?.timeZone ?? "America/Sao_Paulo";
  const now = new Date();

  if (!organizationId) {
    return {
      groups: [],
      transactions: [],
      coverage: {
        stripe: "unconfigured",
        manual: "complete",
      },
    };
  }

  const stripe = getStripeClient();
  const supabase = await createSupabaseServerClient();

  const [stripeResult, manualResult] = await Promise.all([
    fetchStripeSource({
      stripe,
      organizationId,
      now,
    }),
    fetchManualSource({
      supabase,
      organizationId,
    }),
  ]);

  const groups = aggregateFinance({
    invoices: stripeResult.invoices,
    subscriptionItems: stripeResult.subscriptionItems,
    manualSales: manualResult.manualSales,
    now,
    timeZone,
  });

  return {
    groups,
    transactions: stripeResult.transactions,
    coverage: {
      stripe: stripeResult.coverage,
      manual: manualResult.coverage,
      errorCode: stripeResult.errorCode ?? manualResult.errorCode,
    },
  };
}
