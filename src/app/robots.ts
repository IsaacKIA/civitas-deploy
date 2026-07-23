import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/portal'],
        disallow: ['/dashboard/'],
      },
    ],
    sitemap: 'https://civitasestate.com/sitemap.xml',
  };
}
