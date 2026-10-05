import test from "node:test";
import assert from "node:assert/strict";
import { fetchStripeSource } from "../../src/lib/finance/stripe-source.ts";
import { fetchManualSource } from "../../src/lib/finance/manual-source.ts";

test("fetchStripeSource: paginates >100 items and isolates by organizationId", async () => {
  const targetOrg = "org_target_123";
  const foreignOrg = "org_foreign_999";

  // Mock Stripe client with multi-page responses and multi-tenant data
  const mockStripe = {
    subscriptions: {
      list: async (params) => {
        if (!params.starting_after) {
          return {
            has_more: true,
            data: [
              {
                id: "sub_1",
                metadata: { organization_id: targetOrg },
                items: {
                  data: [
                    {
                      price: { unit_amount: 5000, currency: "usd", recurring: { interval: "month", interval_count: 1 } },
                      quantity: 1,
                    },
                  ],
                },
              },
              {
                id: "sub_foreign",
                metadata: { organization_id: foreignOrg },
                items: {
                  data: [
                    {
                      price: { unit_amount: 99999, currency: "usd", recurring: { interval: "month", interval_count: 1 } },
                      quantity: 1,
                    },
                  ],
                },
              },
            ],
          };
        }
        return {
          has_more: false,
          data: [
            {
              id: "sub_2",
              metadata: { organization_id: targetOrg },
              items: {
                data: [
                  {
                    price: { unit_amount: 10000, currency: "usd", recurring: { interval: "month", interval_count: 1 } },
                    quantity: 2,
                  },
                ],
              },
            },
          ],
        };
      },
    },
    invoices: {
      list: async (params) => {
        if (!params.starting_after) {
          return {
            has_more: true,
            data: [
              {
                id: "inv_1",
                currency: "usd",
                amount_paid: 5000,
                amount_remaining: 0,
                status: "paid",
                status_transitions: { paid_at: 1760000000 },
                subscription_details: { metadata: { organization_id: targetOrg } },
                lines: { data: [{ price: { metadata: { organization_id: targetOrg } } }] },
                metadata: { organization_id: targetOrg },
              },
              {
                id: "inv_foreign",
                currency: "usd",
                amount_paid: 88888,
                amount_remaining: 0,
                status: "paid",
                status_transitions: { paid_at: 1760000000 },
                metadata: { organization_id: foreignOrg },
              },
            ],
          };
        }
        return {
          has_more: false,
          data: [
            {
              id: "inv_2",
              currency: "usd",
              amount_paid: 10000,
              amount_remaining: 0,
              status: "paid",
              status_transitions: { paid_at: 1760001000 },
              metadata: { organization_id: targetOrg },
            },
          ],
        };
      },
    },
  };

  const result = await fetchStripeSource({
    stripe: mockStripe,
    organizationId: targetOrg,
    now: new Date("2026-10-04T12:00:00Z"),
  });

  assert.equal(result.coverage, "complete");
  // Multi-page items collected: sub_1 (qty 1, 5000) and sub_2 (qty 2, 10000)
  assert.equal(result.subscriptionItems.length, 2);
  // Foreign sub_foreign excluded!
  assert.ok(!result.subscriptionItems.some((s) => s.unitAmountMinor === 99999));

  // Multi-page invoices collected: inv_1 and inv_2
  assert.equal(result.invoices.length, 2);
  // Foreign inv_foreign excluded!
  assert.ok(!result.invoices.some((i) => i.id === "inv_foreign"));
});

test("fetchStripeSource: reports unconfigured when client is missing", async () => {
  const result = await fetchStripeSource({
    stripe: null,
    organizationId: "org_1",
    now: new Date(),
  });

  assert.equal(result.coverage, "unconfigured");
  assert.equal(result.invoices.length, 0);
  assert.equal(result.subscriptionItems.length, 0);
});

test("fetchStripeSource: reports error and code when Stripe call fails", async () => {
  const failingStripe = {
    subscriptions: {
      list: async () => {
        const error = new Error("Stripe network timeout");
        error.code = "api_connection_error";
        throw error;
      },
    },
    invoices: {
      list: async () => ({ has_more: false, data: [] }),
    },
  };

  const result = await fetchStripeSource({
    stripe: failingStripe,
    organizationId: "org_1",
    now: new Date(),
  });

  assert.equal(result.coverage, "error");
  assert.equal(result.errorCode, "api_connection_error");
});

test("fetchManualSource: paginates >500 rows and scopes by organizationId", async () => {
  const targetOrg = "org_abc";

  const fakeSupabase = {
    from: (table) => {
      assert.equal(table, "manual_sales");
      return {
        select: () => ({
          eq: (col, val) => {
            assert.equal(col, "organization_id");
            assert.equal(val, targetOrg);
            return {
              order: () => ({
                range: async (from, _to) => {
                  if (from === 0) {
                    // First page: 500 rows
                    const data = Array.from({ length: 500 }, (_, _i) => ({
                      amount_cents: 100,
                      sold_at: "2026-10-01",
                    }));
                    return { data, error: null };
                  }
                  // Second page: 50 rows
                  const data = Array.from({ length: 50 }, (_, _i) => ({
                    amount_cents: 200,
                    sold_at: "2026-10-02",
                  }));
                  return { data, error: null };
                },
              }),
            };
          },
        }),
      };
    },
  };

  const result = await fetchManualSource({
    supabase: fakeSupabase,
    organizationId: targetOrg,
  });

  assert.equal(result.coverage, "complete");
  // Total 550 rows collected without truncation!
  assert.equal(result.manualSales.length, 550);
});
