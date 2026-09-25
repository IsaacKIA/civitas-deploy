import DashboardLayout from '@/components/DashboardLayout';
import { getAuthedProfile } from '@/lib/supabase/server';
import ProjectsClient from './ProjectsClient';

export default async function DeveloperProjectsPage() {
  const auth = await getAuthedProfile();

  const developments = [
    {
      id: 'dev-1',
      name: 'Osu Palm Residences',
      type: 'Luxury Townhouses (4-Bed)',
      location: 'Osu, Greater Accra',
      totalUnits: 16,
      completedUnits: 16,
      handedOver: 14,
      dlpActive: 14,
      amenities: ['Central Solar Backup', 'Borehole & RO Filtration', 'Gated Access Control'],
      completionDate: 'June 2026',
    },
    {
      id: 'dev-2',
      name: 'Mankessim Green Estate (Phase 1)',
      type: 'Mixed Residential & Commercial',
      location: 'Mankessim Bypass, Central Region',
      totalUnits: 12,
      completedUnits: 12,
      handedOver: 8,
      dlpActive: 8,
      amenities: ['Solar Streetlighting', 'Commercial Plaza', 'Paved Internal Roads'],
      completionDate: 'August 2026',
    },
    {
      id: 'dev-3',
      name: 'Ridge Heights Apartments',
      type: 'High-Rise 2 & 3 Bedroom Condos',
      location: 'Ridge, Accra',
      totalUnits: 24,
      completedUnits: 18,
      handedOver: 0,
      dlpActive: 0,
      amenities: ['Underground Parking', 'Infinity Pool', 'Dual Perkins Generators'],
      completionDate: 'Q1 2027 (Under Construction)',
    },
  ];

  return (
    <DashboardLayout role="developer" userName={auth?.profile.full_name || 'Property Developer'}>
      <div className="max-w-6xl mx-auto">
        <ProjectsClient initialDevelopments={developments} />
      </div>
    </DashboardLayout>
  );
}
