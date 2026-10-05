import test from "node:test";
import assert from "node:assert/strict";
import Stripe from "stripe";
import { parseCheckoutPayment } from "../../src/lib/stripe-event-validation.ts";
import { processStripeEvent } from "../../src/lib/stripe-webhook-service.ts";

const testSecret = "whsec_test_secret_for_local_contract_testing_only_123456";
const stripe = new Stripe("sk_test_fixture_only_12345", { apiVersion: "2026-03-20" });

test("parseCheckoutPayment: extracts integration and presentment money or null", () => {
  // Case 1: Integration USD 10000 with EUR 9200 presentment
  const eventDataWithPresentment = {
    id: "cs_test_multi_currency",
    payment_link: "plink_123",
    payment_status: "paid",
    amount_total: 10000,
    currency: "usd",
    presentment_details: {
      amount_total: 9200,
      currency: "eur",
    },
  };
  const parsed1 = parseCheckoutPayment(eventDataWithPresentment);
  assert.ok(parsed1);
  assert.equal(parsed1.sessionId, "cs_test_multi_currency");
  assert.equal(parsed1.paymentLinkId, "plink_123");
  assert.equal(parsed1.paymentStatus, "paid");
  assert.deepEqual(parsed1.integration, { amountMinor: 10000, currency: "usd" });
  assert.deepEqual(parsed1.presentment, { amountMinor: 9200, currency: "eur" });

  // Case 2: Presentment absent -> strictly null, never invented conversion
  const eventDataWithoutPresentment = {
    id: "cs_test_single_currency",
    payment_link: "plink_456",
    payment_status: "paid",
    amount_total: 5000,
    currency: "brl",
  };
  const parsed2 = parseCheckoutPayment(eventDataWithoutPresentment);
  assert.ok(parsed2);
  assert.equal(parsed2.presentment, null);
  assert.deepEqual(parsed2.integration, { amountMinor: 5000, currency: "brl" });

  // Case 3: Malformed payload / invalid amount / missing currency -> null
  assert.equal(parseCheckoutPayment(null), null);
  assert.equal(parseCheckoutPayment({ id: "cs_1", amount_total: -100 }), null);
  assert.equal(parseCheckoutPayment({ id: "cs_1", amount_total: 100, currency: "INVALID" }), null);
});

test("processStripeEvent: handles checkout.session.completed and async_payment_succeeded", async () => {
  const eventsApplied = [];
  const mockRepo = {
    resolveOrganization: async (_event) => "org_test_123",
    applyEvent: async (input) => {
      eventsApplied.push(input);
      return { duplicate: false };
    },
  };

  // checkout.session.completed with paid status
  const event1 = {
    id: "evt_1",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_paid_1",
        payment_link: "plink_1",
        payment_status: "paid",
        amount_total: 15000,
        currency: "usd",
      },
    },
  };

  const res1 = await processStripeEvent(event1, mockRepo);
  assert.equal(res1.duplicate, false);
  assert.equal(eventsApplied.length, 1);
  assert.equal(eventsApplied[0].organizationId, "org_test_123");

  // checkout.session.async_payment_succeeded
  const eventAsync = {
    id: "evt_async",
    type: "checkout.session.async_payment_succeeded",
    data: {
      object: {
        id: "cs_async_1",
        payment_link: "plink_2",
        payment_status: "paid",
        amount_total: 7500,
        currency: "eur",
      },
    },
  };

  const res2 = await processStripeEvent(eventAsync, mockRepo);
  assert.equal(res2.duplicate, false);
  assert.equal(eventsApplied.length, 2);

  // Unpaid session does not record a settled payment
  const eventUnpaid = {
    id: "evt_unpaid",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_unpaid_1",
        payment_link: "plink_3",
        payment_status: "unpaid",
        amount_total: 15000,
        currency: "usd",
      },
    },
  };
  await processStripeEvent(eventUnpaid, mockRepo);
  assert.equal(eventsApplied.length, 3);
  const lastApplied = eventsApplied[2];
  assert.equal(lastApplied.payload.settledPayment, null);
});

test("processStripeEvent: idempotency and duplicate events", async () => {
  let callCount = 0;
  const mockRepo = {
    resolveOrganization: async () => "org_1",
    applyEvent: async () => {
      callCount++;
      return { duplicate: callCount > 1 };
    },
  };

  const event = {
    id: "evt_idempotent",
    type: "invoice.paid",
    data: {
      object: {
        id: "in_123",
        amount_paid: 2000,
        currency: "brl",
        status: "paid",
      },
    },
  };

  const resFirst = await processStripeEvent(event, mockRepo);
  assert.equal(resFirst.duplicate, false);

  const resSecond = await processStripeEvent(event, mockRepo);
  assert.equal(resSecond.duplicate, true);
  assert.equal(callCount, 2);
});

test("webhook signature verification via local header fixture", () => {
  const payload = JSON.stringify({ id: "evt_test_sig", type: "invoice.paid" });
  const signature = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: testSecret,
  });

  // Valid signature constructs event successfully
  const event = stripe.webhooks.constructEvent(payload, signature, testSecret);
  assert.equal(event.id, "evt_test_sig");

  // Tampered payload throws error
  const tamperedPayload = payload + " ";
  assert.throws(
    () => stripe.webhooks.constructEvent(tamperedPayload, signature, testSecret),
    /No signatures found matching the expected signature/
  );
});
