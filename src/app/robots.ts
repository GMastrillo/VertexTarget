import type { MetadataRoute } from 'next';
import { getOsConfig } from '../lib/os/config.ts';

export default function robots(): MetadataRoute.Robots {
  const { appUrl } = getOsConfig();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/os/', '/admin/', '/api/'],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
