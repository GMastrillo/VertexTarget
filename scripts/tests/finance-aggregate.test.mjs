import test from "node:test";
import assert from "node:assert/strict";
import { aggregateFinance } from "../../src/lib/finance/aggregate.ts";

test("aggregateFinance: mixed_currency and manual sales scoping", () => {
  const now = new Date("2026-10-04T12:00:00.000Z");
  const timeZone = "America/Sao_Paulo";

  const invoices = [
    {
      id: "inv_brl_1",
      organizationId: "org_1",
      currency: "brl",
      amountPaidMinor: 10000,
      amountRemainingMinor: 0,
      paidAt: "2026-10-02T10:00:00.000Z",
      status: "paid",
    },
    {
      id: "inv_usd_1",
      organizationId: "org_1",
      currency: "usd",
      amountPaidMinor: 20000,
      amountRemainingMinor: 5000,
      paidAt: "2026-10-03T10:00:00.000Z",
      status: "paid",
    },
    {
      id: "inv_eur_1",
      organizationId: "org_1",
      currency: "eur",
      amountPaidMinor: 30000,
      amountRemainingMinor: 0,
      paidAt: "2026-10-04T08:00:00.000Z",
      status: "paid",
    },
    {
      id: "inv_brl_open",
      organizationId: "org_1",
      currency: "brl",
      amountPaidMinor: 0,
      amountRemainingMinor: 1500,
      paidAt: null,
      status: "open",
    },
  ];

  const manualSales = [
    { amountMinor: 5000, soldAt: "2026-10-01" },
    { amountMinor: 8000, soldAt: "2026-08-15" },
  ];

  const groups = aggregateFinance({
    invoices,
    subscriptionItems: [],
    manualSales,
    now,
    timeZone,
  });

  // Exactly 3 distinct currency groups
  assert.equal(groups.length, 3);
  const byCurrency = Object.fromEntries(groups.map((g) => [g.currency.toLowerCase(), g]));

  // BRL group
  assert.ok(byCurrency.brl);
  assert.equal(byCurrency.brl.grossThisMonthMinor, 10000);
  assert.equal(byCurrency.brl.overdueMinor, 1500);
  // Manual sale 5000 is this month, 8000 is past month
  assert.equal(byCurrency.brl.manualThisMonthMinor, 5000);
  assert.equal(byCurrency.brl.manualTotalMinor, 13000);

  // USD group
  assert.ok(byCurrency.usd);
  assert.equal(byCurrency.usd.grossThisMonthMinor, 20000);
  assert.equal(byCurrency.usd.overdueMinor, 5000);
  // Manual sales do NOT leak into USD or EUR
  assert.equal(byCurrency.usd.manualThisMonthMinor, 0);
  assert.equal(byCurrency.usd.manualTotalMinor, 0);

  // EUR group
  assert.ok(byCurrency.eur);
  assert.equal(byCurrency.eur.grossThisMonthMinor, 30000);
  assert.equal(byCurrency.eur.overdueMinor, 0);
  assert.equal(byCurrency.eur.manualThisMonthMinor, 0);
  assert.equal(byCurrency.eur.manualTotalMinor, 0);

  // No group mixes currencies or exposes a scalar global total
  for (const group of groups) {
    assert.equal(typeof group.currency, "string");
    assert.equal(group.revenue.length, 6);
  }
});

test("aggregateFinance: monthly_vs_all_time uses paidAt for invoices and soldAt for manual", () => {
  const now = new Date("2026-10-04T12:00:00.000Z");
  const timeZone = "UTC";

  const invoices = [
    // Invoice paid in September 2026
    {
      id: "inv_sep",
      organizationId: "org_1",
      currency: "usd",
      amountPaidMinor: 50000,
      amountRemainingMinor: 0,
      paidAt: "2026-09-15T10:00:00.000Z",
      status: "paid",
    },
    // Invoice paid in October 2026
    {
      id: "inv_oct",
      organizationId: "org_1",
      currency: "usd",
      amountPaidMinor: 25000,
      amountRemainingMinor: 0,
      paidAt: "2026-10-02T10:00:00.000Z",
      status: "paid",
    },
  ];

  const manualSales = [
    { amountMinor: 7000, soldAt: "2026-07-20" },
  ];

  const groups = aggregateFinance({
    invoices,
    subscriptionItems: [],
    manualSales,
    now,
    timeZone,
  });

  const usd = groups.find((g) => g.currency.toLowerCase() === "usd");
  assert.ok(usd);
  assert.equal(usd.grossThisMonthMinor, 25000); // Only October, not September!

  // Check 6-month revenue buckets
  const sepBucket = usd.revenue.find((b) => b.monthKey === "2026-09");
  assert.ok(sepBucket);
  assert.equal(sepBucket.amountMinor, 50000);

  const octBucket = usd.revenue.find((b) => b.monthKey === "2026-10");
  assert.ok(octBucket);
  assert.equal(octBucket.amountMinor, 25000);

  const brl = groups.find((g) => g.currency.toLowerCase() === "brl");
  assert.ok(brl);
  assert.equal(brl.manualThisMonthMinor, 0); // Sold in July, 0 this month
  assert.equal(brl.manualTotalMinor, 7000);
});

test("aggregateFinance: mrr_interval_count, quantity and unsupported intervals", () => {
  const now = new Date("2026-10-04T12:00:00.000Z");
  const timeZone = "UTC";

  const subscriptionItems = [
    // 12000 minor annual quantity 2 / count 1 -> (12000 * 2) / 12 = 2000 monthly
    {
      currency: "usd",
      unitAmountMinor: 12000,
      quantity: 2,
      interval: "year",
      intervalCount: 1,
    },
    // Quarterly 9000 minor / count 3 -> 9000 / 3 = 3000 monthly
    {
      currency: "usd",
      unitAmountMinor: 9000,
      quantity: 1,
      interval: "month",
      intervalCount: 3,
    },
    // Standard monthly: 5000 * 1 = 5000
    {
      currency: "eur",
      unitAmountMinor: 5000,
      quantity: 1,
      interval: "month",
      intervalCount: 1,
    },
    // Unsupported interval (week)
    {
      currency: "eur",
      unitAmountMinor: 1000,
      quantity: 1,
      interval: "week",
      intervalCount: 1,
    },
  ];

  const groups = aggregateFinance({
    invoices: [],
    subscriptionItems,
    manualSales: [],
    now,
    timeZone,
  });

  const usd = groups.find((g) => g.currency.toLowerCase() === "usd");
  assert.ok(usd);
  assert.equal(usd.mrrMinor, 2000 + 3000); // 5000
  assert.equal(usd.mrrCoverage, "complete");

  const eur = groups.find((g) => g.currency.toLowerCase() === "eur");
  assert.ok(eur);
  assert.equal(eur.mrrMinor, 5000); // weekly item does NOT add fake MRR
  assert.equal(eur.mrrCoverage, "unsupported_interval"); // correctly flagged!
});
