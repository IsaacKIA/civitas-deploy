import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Civitas PropTech — Smart Living & Maintenance',
    short_name: 'Civitas',
    description: 'Ghana\'s integrated platform for smart estate management, solar energy telemetry, 24/7 SLA maintenance dispatch, and impact investing.',
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
