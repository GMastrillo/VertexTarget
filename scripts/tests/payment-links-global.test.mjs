import test from "node:test";
import assert from "node:assert/strict";
import { parsePaymentLinkAction } from "../../src/lib/payment-link-validation.ts";
import { createPaymentLink } from "../../src/lib/payment-link-service.ts";
import { PAYMENT_CAPABILITIES } from "../../src/lib/finance/payment-capabilities.ts";

test("payment capabilities: strictly 1 installment and approved base currencies", () => {
  assert.equal(PAYMENT_CAPABILITIES.installmentsAllowed, false);
  assert.deepEqual(PAYMENT_CAPABILITIES.baseCurrencies, ["brl", "usd", "eur"]);
});

test("parsePaymentLinkAction: validates currencies, amounts, installments and requestId", () => {
  // Valid BRL, USD, EUR with requestId
  const validUsd = parsePaymentLinkAction({
    action: "payment-link.create",
    kind: "one_time",
    amountCents: 5000,
    currency: "usd",
    description: "Design consulting",
    installments: 1,
    requestId: "11111111-1111-1111-1111-111111111111",
  });
  assert.equal(validUsd.ok, true);
  if (validUsd.ok) {
    assert.equal(validUsd.value.currency, "usd");
    assert.equal(validUsd.value.amountCents, 5000);
    assert.equal(validUsd.value.requestId, "11111111-1111-1111-1111-111111111111");
  }

  // Reject unapproved currency (e.g. gbp, jpy)
  const invalidCurr = parsePaymentLinkAction({
    action: "payment-link.create",
    kind: "one_time",
    amountCents: 5000,
    currency: "gbp",
    description: "Test GBP",
  });
  assert.equal(invalidCurr.ok, false);

  // Reject installments > 1 (installmentsAllowed is false in this release)
  const invalidInstallments = parsePaymentLinkAction({
    action: "payment-link.create",
    kind: "one_time",
    amountCents: 5000,
    currency: "brl",
    description: "Test 3x",
    installments: 3,
  });
  assert.equal(invalidInstallments.ok, false);
  if (!invalidInstallments.ok) {
    assert.equal(invalidInstallments.reason, "installments_not_supported");
  }

  // Reject amount < 1 or > 100_000_000_00
  assert.equal(
    parsePaymentLinkAction({
      action: "payment-link.create",
      kind: "one_time",
      amountCents: 0,
      currency: "usd",
      description: "Zero",
    }).ok,
    false
  );
  assert.equal(
    parsePaymentLinkAction({
      action: "payment-link.create",
      kind: "one_time",
      amountCents: 100_000_000_01,
      currency: "usd",
      description: "Too large",
    }).ok,
    false
  );

  // Reject client-supplied organization_id
  const rejectedOrg = parsePaymentLinkAction({
    action: "payment-link.create",
    kind: "one_time",
    amountCents: 1000,
    currency: "usd",
    description: "Test",
    organization_id: "org_evil",
  });
  assert.equal(rejectedOrg.ok, false);
});

test("createPaymentLink: idempotency and retry with same payload returns existing link", async () => {
  const operations = new Map();
  let productCreations = 0;
  let priceCreations = 0;
  let linkCreations = 0;

  const mockCompletedLink = {
    id: "pl_saved_1",
    stripePaymentLinkId: "plink_123",
    url: "https://buy.stripe.com/test_123",
    kind: "one_time",
    status: "active",
    amountCents: 10000,
    currency: "usd",
    recurringInterval: null,
    installments: 1,
    description: "Consulting",
    clientId: null,
    dealId: null,
    createdAt: new Date().toISOString(),
  };

  const dependencies = {
    authorize: async () => ({ organizationId: "org_1", userId: "usr_1" }),
    claimOperation: async (_context, requestId, payloadHash) => {
      const existing = operations.get(requestId);
      if (existing) {
        if (existing.payloadHash !== payloadHash) {
          throw new Error("Conflict: requestId already used with different payload");
        }
        if (existing.status === "completed") {
          return { operationId: existing.id, completedLink: existing.link, executor: false };
        }
        if (existing.status === "pending") {
          throw new Error("Conflict: operation currently in progress");
        }
      }
      const newOp = { id: `op_${requestId}`, payloadHash, status: "pending", link: null };
      operations.set(requestId, newOp);
      return { operationId: newOp.id, completedLink: null, executor: true };
    },
    createProduct: async () => {
      productCreations++;
      return { id: "prod_123" };
    },
    createPrice: async () => {
      priceCreations++;
      return { id: "price_123" };
    },
    createLink: async () => {
      linkCreations++;
      return { id: "plink_123", url: "https://buy.stripe.com/test_123" };
    },
    completeOperation: async (_context, operationId, _resources, _input) => {
      const op = [...operations.values()].find((o) => o.id === operationId);
      if (op) {
        op.status = "completed";
        op.link = mockCompletedLink;
      }
      return mockCompletedLink;
    },
    failOperation: async (_context, operationId, _code) => {
      const op = [...operations.values()].find((o) => o.id === operationId);
      if (op) op.status = "failed";
    },
  };

  const inputAction = {
    action: "payment-link.create",
    kind: "one_time",
    amountCents: 10000,
    currency: "usd",
    description: "Consulting",
    installments: 1,
    requestId: "22222222-2222-2222-2222-222222222222",
  };

  // First run: executes all creations
  const firstResult = await createPaymentLink(inputAction, dependencies);
  assert.equal(firstResult.id, "pl_saved_1");
  assert.equal(productCreations, 1);
  assert.equal(priceCreations, 1);
  assert.equal(linkCreations, 1);

  // Second run with same requestId and payload: returns completed link WITHOUT creating again!
  const secondResult = await createPaymentLink(inputAction, dependencies);
  assert.equal(secondResult.id, "pl_saved_1");
  assert.equal(productCreations, 1); // No new creation!
  assert.equal(priceCreations, 1);
  assert.equal(linkCreations, 1);

  // Third run with same requestId but different payload: throws conflict
  const conflictingAction = {
    ...inputAction,
    amountCents: 99999, // different!
  };
  await assert.rejects(
    () => createPaymentLink(conflictingAction, dependencies),
    /Conflict: requestId already used with different payload/
  );
});
