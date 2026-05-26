import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@lib';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/']
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
