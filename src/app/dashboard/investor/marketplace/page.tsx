'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

interface Project {
  id: string;
  name: string;
  location: string;
  category: string;
  target: number;
  raised: number;
  irr: string;
  minInvestment: number;
  esgGrade: string;
  description: string;
  bannerGradient: string;
  emoji: string;
}

export default function InvestorMarketplacePage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState(5000);
  const [paymentRail, setPaymentRail] = useState<'momo' | 'wire' | 'wise'>('momo');
  const [committed, setCommitted] = useState(false);

  const projects: Project[] = [
    {
      id: 'PRJ-01',
      name: 'Civitas Green Township',
      location: 'Mankessim, Central Region',
      category: 'Net-Zero Residential',
      target: 5000000,
      raised: 3200000,
      irr: '16–18% p.a.',
      minInvestment: 5000,
      esgGrade: 'A+',
      description: '500 net-zero homes equipped with integrated solar micro-grids, rainwater harvesting, and biogas waste recovery.',
      bannerGradient: 'from-[#0F3D26] to-[#1A5C3A]',
      emoji: '🌿'
    },
    {
      id: 'PRJ-02',
      name: 'Rural Energy Hubs',
      location: 'Northern & Volta Regions',
      category: 'Clean Energy Infrastructure',
      target: 2000000,
      raised: 1260000,
      irr: '14–16% p.a.',
      minInvestment: 2500,
      esgGrade: 'A',
      description: 'Decentralized solar micro-grids bringing 24/7 power to 12 agricultural communities across Northern Ghana.',
      bannerGradient: 'from-[#7c2d12] to-[#E87722]',
      emoji: '⚡'
    },
    {
      id: 'PRJ-03',
      name: 'Clean City Initiative',
      location: 'Greater Accra Metro',
      category: 'Urban Bio-Waste & Recycling',
      target: 1500000,
      raised: 800000,
      irr: '12–15% p.a.',
      minInvestment: 1000,
      esgGrade: 'B+',
      description: 'AI-monitored smart waste collection, plastic recycling plants, and community biogas energy units.',
      bannerGradient: 'from-[#0d4a38] to-[#2E8B6A]',
      emoji: '♻️'
    }
  ];

  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault();
    setCommitted(true);
  };

  return (
    <DashboardLayout role="investor" userName="Dr. Abena Mensah">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F3D26]">Impact Investment Marketplace</h1>
          <p className="text-xs text-[#6B7E72] mt-1">Browse vetted Ghanaian green developments & commit funds securely to escrow</p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {projects.map((prj) => {
          const progressPct = Math.round((prj.raised / prj.target) * 100);
          return (
            <div key={prj.id} className="bg-white rounded-3xl border border-[#D8E4DC] overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className={`h-44 bg-gradient-to-br ${prj.bannerGradient} p-6 text-white flex flex-col justify-between`}>
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">{prj.category}</span>
                    <span className="px-2.5 py-1 rounded-full bg-[#E87722] text-[10px] font-bold">ESG {prj.esgGrade}</span>
                  </div>
                  <div>
                    <span className="text-2xl">{prj.emoji}</span>
                    <h3 className="text-lg font-serif font-bold mt-1">{prj.name}</h3>
                    <p className="text-xs text-white/70">{prj.location}</p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs text-[#6B7E72] leading-relaxed">{prj.description}</p>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-[#111A14]">
                      <span>Raised: GHS {(prj.raised / 1000).toFixed(0)}K</span>
                      <span>Target: GHS {(prj.target / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="w-full bg-[#D8E4DC] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#1A5C3A] h-full rounded-full" style={{ width: `${progressPct}%` }} />
                    </div>
                    <div className="text-right text-[10px] font-bold text-[#1A5C3A]">{progressPct}% Funded</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs border-t border-[#D8E4DC]">
                    <div>
                      <span className="text-[10px] text-[#6B7E72] uppercase font-semibold block">Target IRR</span>
                      <span className="font-bold text-[#1A5C3A]">{prj.irr}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6B7E72] uppercase font-semibold block">Min Investment</span>
                      <span className="font-bold text-[#111A14]">GHS {prj.minInvestment.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => { setSelectedProject(prj); setInvestmentAmount(prj.minInvestment); setCommitted(false); }}
                  className="w-full py-3 rounded-full bg-[#0F3D26] hover:bg-[#1A5C3A] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
                >
                  Invest in Project →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Investment Commitment Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 text-xl text-[#6B7E72] hover:text-[#111A14]"
            >
              ✕
            </button>

            {committed ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[#EEF7F2] text-[#1A5C3A] text-3xl flex items-center justify-center mx-auto mb-4">📜</div>
                <h3 className="text-2xl font-serif font-bold text-[#0F3D26] mb-2">Escrow Funds Committed!</h3>
                <p className="text-xs text-[#6B7E72] mb-6">
                  You committed <strong className="text-[#111A14]">GHS {investmentAmount.toLocaleString()}</strong> to <strong className="text-[#0F3D26]">{selectedProject.name}</strong>.
                </p>
                <div className="p-4 bg-[#F5F9F6] rounded-2xl text-[10px] text-[#6B7E72] mb-6">
                  Bank of Ghana Escrow Ref: <span className="font-mono font-bold text-[#1A5C3A]">BOG-ESC-2025-9918</span>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-full py-3 rounded-full bg-[#1A5C3A] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Return to Marketplace →
                </button>
              </div>
            ) : (
              <form onSubmit={handleCommit} className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E87722]">Project Escrow Commitment</span>
                  <h3 className="text-2xl font-serif font-bold text-[#0F3D26] mt-1">{selectedProject.name}</h3>
                  <p className="text-xs text-[#6B7E72]">{selectedProject.location} · Expected IRR: {selectedProject.irr}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-1.5">Investment Amount (GHS)</label>
                  <input
                    type="number"
                    min={selectedProject.minInvestment}
                    step="500"
                    value={investmentAmount}
                    onChange={e => setInvestmentAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-[#D8E4DC] outline-none focus:border-[#1A5C3A] font-bold"
                  />
                  <p className="text-[10px] text-[#6B7E72] mt-1">Minimum required: GHS {selectedProject.minInvestment.toLocaleString()}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111A14] mb-2">Payment Rail / Funding Source</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentRail('momo')}
                      className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${paymentRail === 'momo' ? 'bg-[#EEF7F2] text-[#1A5C3A] border-[#1A5C3A]' : 'bg-white text-[#6B7E72] border-[#D8E4DC]'}`}
                    >
                      📱 MTN MoMo
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentRail('wire')}
                      className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${paymentRail === 'wire' ? 'bg-[#EEF7F2] text-[#1A5C3A] border-[#1A5C3A]' : 'bg-white text-[#6B7E72] border-[#D8E4DC]'}`}
                    >
                      🏦 USD Wire
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentRail('wise')}
                      className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${paymentRail === 'wise' ? 'bg-[#EEF7F2] text-[#1A5C3A] border-[#1A5C3A]' : 'bg-white text-[#6B7E72] border-[#D8E4DC]'}`}
                    >
                      🌐 Wise Transfer
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-[#F5F9F6] rounded-2xl text-[10px] text-[#6B7E72] leading-relaxed">
                  🔒 Funds are held in Bank of Ghana regulated escrow accounts and released only upon project milestone verification by independent engineering auditors.
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#E87722] hover:bg-[#B85A10] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
                >
                  Confirm Escrow Deposit →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
