import type { SiteDocument } from './types.ts';

export function publicDocument(input: SiteDocument): SiteDocument {
  const base = {
    templateId: input.templateId,
    themeId: input.themeId,
    businessName: input.businessName,
    title: input.title,
    subtitle: input.subtitle,
    description: input.description,
    services: (input.services ?? []).map((service) => ({
      title: service.title,
      description: service.description,
    })),
    ctaLabel: input.ctaLabel,
    email: input.email,
    whatsapp: input.whatsapp,
    city: input.city,
  };

  if (input.schemaVersion === 2) {
    return {
      schemaVersion: 2,
      ...base,
      locale: input.locale,
      country: input.country,
      timeZone: input.timeZone,
    };
  }

  return {
    schemaVersion: 1,
    ...base,
  };
}

export function generateSlug(name: string): string {
  const normalized = (name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const base = normalized.length > 0 ? normalized : 'site';
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 6);
  return `${base}-${suffix}`;
}
