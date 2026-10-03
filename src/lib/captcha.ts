import { getOsConfig } from './os/config.ts';
import { isValidCaptchaResponse } from './captcha-validation.ts';

export interface VerifyCaptchaInput {
  token: string;
  expectedHostname?: string | null;
}

/**
 * Verifies an hCaptcha response token against the hCaptcha siteverify API.
 * Fails closed if the secret is not configured or if verification fails.
 */
export async function verifyCaptcha(input: VerifyCaptchaInput): Promise<boolean> {
  const config = getOsConfig();
  if (!config.hcaptchaSecret) {
    return false;
  }

  if (!input.token || typeof input.token !== 'string' || input.token.trim().length === 0) {
    return false;
  }

  try {
    const params = new URLSearchParams();
    params.set('secret', config.hcaptchaSecret);
    params.set('response', input.token.trim());

    const res = await fetch('https://api.hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return false;
    }

    const data: unknown = await res.json();
    return isValidCaptchaResponse(data, input.expectedHostname);
  } catch {
    return false;
  }
}
