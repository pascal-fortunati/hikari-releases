import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/content';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '',
    '/hikari-ia',
    '/captures',
    '/telecharger',
    '/versions',
    '/installation',
    '/credits',
    '/mentions-legales',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === '/versions' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : path === '/telecharger' ? 0.9 : 0.6,
  }));
}
