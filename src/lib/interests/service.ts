import { createHash } from 'node:crypto';
import { getOsConfig } from '../os/config.ts';
import { verifyCaptcha } from '../captcha.ts';
import { executeInterest, type InterestPorts } from './execution.ts';
import { extractClientIp, hashIdentifier } from './rate-limit.ts';
import { reserveInterestRequest, saveInterestRecord, listInterests } from './repository.ts';
import type { InterestInput, InterestRecord } from './types.ts';

function computePayloadHash(input: InterestInput): string {
  const normalized = {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    whatsapp: input.whatsapp.trim(),
    journey: input.journey,
    interest: input.interest,
    message: input.message.trim(),
    marketingConsent: Boolean(input.marketingConsent),
    noticeVersion: input.noticeVersion,
    source: input.source,
  };
  return createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
}

export async function submitInterest(request: Request, input: InterestInput): Promise<void> {
  const config = getOsConfig();
  const secret = config.requestLimitSecret || 'vertex-default-rate-salt-2026';
  const clientIp = extractClientIp(request, config.trustedProxy);

  const ipHash = hashIdentifier(clientIp, secret);
  const emailHash = hashIdentifier(input.email, secret);
  const payloadHash = computePayloadHash(input);

  const expectedHostname = config.appUrl ? new URL(config.appUrl).hostname : undefined;

  const ports: InterestPorts = {
    reserve: async () => {
      return reserveInterestRequest({
        ipHash,
        emailHash,
        key: input.idempotencyKey,
        payloadHash,
      });
    },
    verify: async () => {
      return verifyCaptcha({
        token: input.captchaToken,
        expectedHostname,
      });
    },
    save: async () => {
      await saveInterestRecord({
        key: input.idempotencyKey,
        payloadHash,
        record: {
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          whatsapp: input.whatsapp.trim(),
          journey: input.journey,
          interest: input.interest,
          message: input.message.trim(),
          marketingConsent: input.marketingConsent,
          noticeVersion: input.noticeVersion,
          source: input.source,
        },
      });
    },
  };

  await executeInterest(input, ports);
}

export async function listTeamInterests(): Promise<InterestRecord[]> {
  return listInterests();
}
