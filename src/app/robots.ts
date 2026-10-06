import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/portal'],
        disallow: [
          '/dashboard/',
          '/api/',
        ],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'Applebot', 'DuckDuckBot'],
        allow: ['/', '/portal'],
        disallow: [
          '/dashboard/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://www.civitasestate.com/sitemap.xml',
    host: 'https://www.civitasestate.com',
  };
}
