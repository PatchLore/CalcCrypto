import type { MetadataRoute } from 'next';
import { CALCULATORS } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.calccrypto.com';
  const now = new Date();

  const staticRoutes = [
    '/',
    '/calculators',
    '/about',
    '/privacy',
    '/terms',
  ];

  const calculatorRoutes = CALCULATORS.map((c) => c.path);

  const urls = [...staticRoutes, ...calculatorRoutes].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '/' ? 1 : path === '/calculators' ? 0.9 : 0.7,
  }));

  return urls;
}

