import type { MetadataRoute } from 'next';
import { getOsConfig } from '../lib/os/config.ts';

export default function sitemap(): MetadataRoute.Sitemap {
  const { appUrl } = getOsConfig();
  const routes = [
    '',
    '/plataforma',
    '/cases',
    '/termos',
    '/privacidade',
  ];

  const now = new Date();

  return routes.map((route) => ({
    url: `${appUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route === '/plataforma' ? 0.9 : 0.7,
  }));
}
