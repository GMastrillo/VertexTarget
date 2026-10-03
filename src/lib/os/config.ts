export interface OsConfig {
  appUrl: string;
  geminiKey: string | null;
  geminiModel: 'gemini-3.8-flash';
  hcaptchaSiteKey: string | null;
  hcaptchaSecret: string | null;
  requestLimitSecret: string | null;
  authRecoverySecret: string | null;
  globalCopyLimit: number;
  globalSearchLimit: number;
  trustedProxy: 'vercel' | 'cloudflare' | 'none';
}

function parseProxySetting(val: string | undefined): 'vercel' | 'cloudflare' | 'none' {
  if (val === 'vercel' || val === 'cloudflare') {
    return val;
  }
  return 'none';
}

function parseAppUrl(env: NodeJS.ProcessEnv): string {
  const url = env.APP_URL || env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004';
  return url.replace(/\/$/, '');
}

function parseLimits(env: NodeJS.ProcessEnv): { copy: number; search: number } {
  const copy = Number.parseInt(env.OS_GLOBAL_COPY_LIMIT || '1000', 10);
  const search = Number.parseInt(env.OS_GLOBAL_SEARCH_LIMIT || '100', 10);
  return {
    copy: Number.isNaN(copy) ? 1000 : copy,
    search: Number.isNaN(search) ? 100 : search,
  };
}

export function getOsConfig(): OsConfig {
  const env = process.env;
  const limits = parseLimits(env);

  return {
    appUrl: parseAppUrl(env),
    geminiKey: env.GEMINI_API_KEY || env.GOOGLE_GEMINI_API_KEY || null,
    geminiModel: 'gemini-3.8-flash',
    hcaptchaSiteKey: env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || null,
    hcaptchaSecret: env.HCAPTCHA_SECRET_KEY || null,
    requestLimitSecret: env.REQUEST_LIMIT_SECRET || null,
    authRecoverySecret: env.AUTH_RECOVERY_SECRET || null,
    globalCopyLimit: limits.copy,
    globalSearchLimit: limits.search,
    trustedProxy: parseProxySetting(env.TRUSTED_PROXY),
  };
}
