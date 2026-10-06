import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.civitasestate.com';
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/portal`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];
}
