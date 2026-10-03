export const FREE_LIMITS = Object.freeze({
  maxWorkspaces: 1,
  maxProjects: 1,
  maxPublishedSites: 1,
  monthlyCopyLimit: 3,
  monthlySearchLimit: 1,
  maxProspects: 50,
  globalCopyLimit: 1000,
  globalSearchLimit: 100,
  aiOutputTokens: 2048,
  aiTimeoutMs: 45000,
});

export const BODY_LIMITS = Object.freeze({
  auth: 8192,
  interests: 8192,
  project: 32768,
  prospect: 8192,
  publication: 8192,
});

export function usagePeriod(now: Date): { period: string; renewsAt: string } {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth(); // 0-indexed
  const period = `${year}-${String(month + 1).padStart(2, '0')}`;
  const renewsAt = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0)).toISOString();
  return { period, renewsAt };
}
