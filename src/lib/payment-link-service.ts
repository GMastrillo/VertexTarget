import { createHash, randomUUID } from "node:crypto";
import type {
  PaymentLink,
  PaymentOperationContext,
  PaymentResourceIds,
} from "./payment-link-types.ts";
import type { PaymentLinkAction } from "./payment-link-validation.ts";

export type PaymentLinkServiceDependencies = {
  authorize: (input: PaymentLinkAction) => Promise<PaymentOperationContext>;
  claimOperation: (
    context: PaymentOperationContext,
    requestId: string,
    payloadHash: string
  ) => Promise<{
    operationId: string;
    completedLink: PaymentLink | null;
    executor: boolean;
  }>;
  createProduct: (
    input: PaymentLinkAction,
    idempotencyKey: string
  ) => Promise<{ id: string }>;
  createPrice: (
    input: PaymentLinkAction,
    productId: string,
    idempotencyKey: string
  ) => Promise<{ id: string }>;
  createLink: (
    input: PaymentLinkAction,
    priceId: string,
    idempotencyKey: string
  ) => Promise<{ id: string; url: string }>;
  completeOperation: (
    context: PaymentOperationContext,
    operationId: string,
    resourceIds: PaymentResourceIds,
    input: PaymentLinkAction
  ) => Promise<PaymentLink>;
  failOperation: (
    context: PaymentOperationContext,
    operationId: string,
    errorCode: string
  ) => Promise<void>;
};

function computePayloadHash(input: PaymentLinkAction): string {
  const canonical = JSON.stringify({
    kind: input.kind,
    amountCents: input.amountCents,
    currency: input.currency,
    description: input.description,
    recurringInterval: input.recurringInterval ?? null,
    installments: input.installments,
    clientId: input.clientId ?? null,
    dealId: input.dealId ?? null,
  });
  return createHash("sha256").update(canonical).digest("hex");
}

export async function createPaymentLink(
  input: PaymentLinkAction,
  dependencies: PaymentLinkServiceDependencies
): Promise<PaymentLink> {
  const requestId = input.requestId ?? randomUUID();
  const payloadHash = computePayloadHash(input);

  const context = await dependencies.authorize(input);
  const claim = await dependencies.claimOperation(context, requestId, payloadHash);

  if (claim.completedLink) {
    return claim.completedLink;
  }
  if (!claim.executor) {
    throw new Error("Conflict: operation currently in progress by another request");
  }

  const prodKey = `${claim.operationId}_product`;
  const priceKey = `${claim.operationId}_price`;
  const linkKey = `${claim.operationId}_link`;

  try {
    const prod = await dependencies.createProduct(input, prodKey);
    const price = await dependencies.createPrice(input, prod.id, priceKey);
    const link = await dependencies.createLink(input, price.id, linkKey);

    const resourceIds: PaymentResourceIds = {
      productId: prod.id,
      priceId: price.id,
      linkId: link.id,
      url: link.url,
    };

    return await dependencies.completeOperation(
      context,
      claim.operationId,
      resourceIds,
      input
    );
  } catch (err) {
    const code = err instanceof Error ? err.message : "operation_failed";
    await dependencies.failOperation(context, claim.operationId, code);
    throw err;
  }
}
