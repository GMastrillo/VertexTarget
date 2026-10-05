import type { MetadataRoute } from 'next';
import { getOsConfig } from '../lib/os/config.ts';
import { SUPPORTED_LOCALES } from '../lib/i18n/locales.ts';
import { CASES } from '../lib/constants.ts';

export default function sitemap(): MetadataRoute.Sitemap {
  const { appUrl } = getOsConfig();
  const baseRoutes = [
    '',
    '/plataforma',
    '/cases',
    '/termos',
    '/privacidade',
  ];

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of SUPPORTED_LOCALES) {
    for (const route of baseRoutes) {
      entries.push({
        url: `${appUrl}/${locale}${route}`,
        lastModified: now,
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : route === '/plataforma' ? 0.9 : 0.7,
      });
    }

    for (const item of CASES) {
      entries.push({
        url: `${appUrl}/${locale}/cases/${item.id}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  return entries;
}
