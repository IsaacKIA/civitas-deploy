import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default function DiasporaOwnerDashboard() {
  const cards = [
    {
      emoji: '🏠',
      title: 'My Properties',
      desc: 'View all your Ghana properties, their maintenance status, and occupancy at a glance.',
      href: '/dashboard/investor/properties',
      ready: true,
    },
    {
      emoji: '🤝',
      title: 'Local Agent',
      desc: 'Assign a trusted local contact to act on your behalf for inspections and coordination.',
      href: '/dashboard/investor/agent',
      ready: true,
    },
    {
      emoji: '📸',
      title: 'Remote Inspections',
      desc: 'Book an on-site inspection. Your local agent uploads photos and a condition report.',
      href: '/dashboard/investor/inspection',
      ready: true,
    },
    {
      emoji: '💱',
      title: 'Remittance & Payments',
      desc: 'Track rental income received, view payment history, and see overseas transfer records.',
      href: '/dashboard/investor/remittance',
      ready: true,
    },
    {
      emoji: '📄',
      title: 'Documents',
      desc: 'Access inspection reports, tenancy agreements, and property certificates.',
      href: '/dashboard/investor/documents',
      ready: true,
    },
    {
      emoji: '🌿',
      title: 'ESG Report',
      desc: 'Solar output, carbon offsets, and sustainability metrics for your properties.',
      href: '/dashboard/investor/esg',
      ready: true,
    },
  ];

  return (
    <DashboardLayout role="investor">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Welcome banner */}
        <div className="bg-gradient-to-br from-[#0F3D26] to-[#1A5C3A] rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(232,119,34,0.15)_0%,transparent_60%)] pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-[11px] font-semibold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E87722] animate-pulse" />
              Diaspora Owner Portal
            </div>
            <h1 className="text-2xl font-serif font-bold mb-2">Welcome to Your Remote Dashboard</h1>
            <p className="text-sm text-white/70 leading-relaxed max-w-xl">
              Civitas gives you trusted local oversight of your Ghana properties — inspections, maintenance
              coordination, rental income tracking, and documentation — all managed from wherever you are in the world.
            </p>
          </div>
        </div>

        {/* Feature cards */}
        <div>
          <h2 className="text-sm font-semibold text-[#6B7E72] uppercase tracking-widest mb-4">Your Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-2xl border border-[#D8E4DC] p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{card.emoji}</span>
                  {!card.ready && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] text-[10px] font-semibold">Coming soon</span>
                  )}
                </div>
                <h3 className="text-sm font-serif font-bold text-[#111A14] mb-1">{card.title}</h3>
                <p className="text-[11px] text-[#6B7E72] leading-relaxed flex-1 mb-4">{card.desc}</p>
                {card.ready ? (
                  <Link href={card.href} className="text-[11px] font-semibold text-[#1A5C3A] hover:underline">
                    Open →
                  </Link>
                ) : (
                  <span className="text-[11px] font-semibold text-[#6B7E72]">In development</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact prompt */}
        <div className="bg-[#F5F9F6] border border-[#D8E4DC] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-2xl">📞</div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-[#111A14] mb-0.5">Need help with your property?</div>
            <p className="text-xs text-[#6B7E72]">Call or WhatsApp our Mankessim office and we&apos;ll coordinate everything locally on your behalf.</p>
          </div>
          <a
            href="tel:+233555062589"
            className="flex-shrink-0 px-5 py-2.5 rounded-full bg-[#1A5C3A] hover:bg-[#2E7D52] text-white text-xs font-semibold transition-all"
          >
            +233 55 506 2589
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
