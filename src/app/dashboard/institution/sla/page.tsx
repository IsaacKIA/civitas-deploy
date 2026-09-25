import DashboardLayout from '@/components/DashboardLayout';
import { getAuthedProfile } from '@/lib/supabase/server';
import SlaClient from './SlaClient';

export default async function InstitutionSlaPage() {
  const auth = await getAuthedProfile();

  const slaMetrics = [
    {
      tier: 'Category 1: Life-Safety & Total Blackout',
      description: 'Main generator failure, fire pump offline, main electrical breaker trip',
      target: '2 Hours On-Site',
      actual: '42 mins avg',
      compliance: '100%',
      complianceColor: 'text-[#047857]',
      incidentsYear: 3,
    },
    {
      tier: 'Category 2: Elevators & Passenger Entrapment',
      description: 'Lift car breakdown, door sensor fault, hoist safety trip',
      target: '3 Hours On-Site',
      actual: '1 hr 18 mins avg',
      compliance: '100%',
      complianceColor: 'text-[#047857]',
      incidentsYear: 2,
    },
    {
      tier: 'Category 3: Central HVAC & Chiller Outage',
      description: 'Auditorium, IT server rooms, medical storage chiller trip',
      target: '4 Hours On-Site',
      actual: '2 hrs 10 mins avg',
      compliance: '96.4%',
      complianceColor: 'text-[#047857]',
      incidentsYear: 5,
    },
    {
      tier: 'Category 4: Water Systems & Booster Pumps',
      description: 'Campus water distribution stoppage, borehole pump failure',
      target: '4 Hours On-Site',
      actual: '1 hr 45 mins avg',
      compliance: '100%',
      complianceColor: 'text-[#047857]',
      incidentsYear: 4,
    },
    {
      tier: 'Category 5: Standard Facilities Maintenance',
      description: 'Minor plumbing leaks, lighting fixtures, joinery, painting touch-ups',
      target: '24 Hours On-Site',
      actual: '6 hrs 40 mins avg',
      compliance: '98.8%',
      complianceColor: 'text-[#047857]',
      incidentsYear: 18,
    },
  ];

  const directorName = auth?.profile.full_name || 'Facilities Director';

  return (
    <DashboardLayout role="institution" userName={directorName}>
      <div className="max-w-6xl mx-auto">
        <SlaClient directorName={directorName} slaMetrics={slaMetrics} />
      </div>
    </DashboardLayout>
  );
}
