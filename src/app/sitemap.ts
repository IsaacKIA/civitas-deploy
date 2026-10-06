import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.civitasestate.com';
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          'en-GH': baseUrl,
          en: baseUrl,
        },
      },
      images: [
        `${baseUrl}/og-image.png`,
        `${baseUrl}/brand/civitas-logo.png`,
      ],
    },
    {
      url: `${baseUrl}/portal`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          'en-GH': `${baseUrl}/portal`,
          en: `${baseUrl}/portal`,
        },
      },
    },
  ];
}
