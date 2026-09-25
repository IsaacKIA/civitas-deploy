import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/portal'],
        disallow: [
          '/dashboard/',
          '/api/',
          '/_next/',
          '/static/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/portal'],
        disallow: ['/dashboard/', '/api/'],
      },
    ],
    sitemap: 'https://civitasestate.com/sitemap.xml',
    host: 'https://civitasestate.com',
  };
}
