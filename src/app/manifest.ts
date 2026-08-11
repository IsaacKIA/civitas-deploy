import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Civitas PropTech — Smart Living & Maintenance',
    short_name: 'Civitas',
    description: 'Ghana\'s integrated platform for property management: Rent Act 220 compliant rent payments via Mobile Money, tenant and maintenance tracking, and solar-ready property listings.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F3D26',
    theme_color: '#0F3D26',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
