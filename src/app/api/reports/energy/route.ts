import type { NextRequest } from 'next/server';
import { buildReportHtml, htmlResponse, formatDate, getParam } from '@/lib/report-builder';

// Stub data — replace with Supabase queries in production
const ENERGY_MONTHLY = [
  { month: 'Jan 2026', property: 'Main Residence', kwh: 410, cost: 'GHS 328', solar: 95, grid: 315, solarPct: 23 },
  { month: 'Feb 2026', property: 'Main Residence', kwh: 388, cost: 'GHS 310', solar: 102, grid: 286, solarPct: 26 },
  { month: 'Mar 2026', property: 'Main Residence', kwh: 425, cost: 'GHS 340', solar: 118, grid: 307, solarPct: 28 },
  { month: 'Apr 2026', property: 'Main Residence', kwh: 398, cost: 'GHS 318', solar: 124, grid: 274, solarPct: 31 },
  { month: 'May 2026', property: 'Main Residence', kwh: 442, cost: 'GHS 354', solar: 136, grid: 306, solarPct: 31 },
  { month: 'Jun 2026', property: 'Main Residence', kwh: 461, cost: 'GHS 369', solar: 148, grid: 313, solarPct: 32 },
  { month: 'Jul 2026', property: 'Main Residence', kwh: 475, cost: 'GHS 380', solar: 155, grid: 320, solarPct: 33 },
  { month: 'Aug 2026', property: 'Main Residence', kwh: 453, cost: 'GHS 362', solar: 160, grid: 293, solarPct: 35 },
  { month: 'Sep 2026', property: 'Main Residence', kwh: 438, cost: 'GHS 350', solar: 162, grid: 276, solarPct: 37 },
];

function bar(pct: number, color: string): string {
  return `
    <div style="display:flex;align-items:center;gap:8px;">
      <div style="flex:1;height:6px;background:#E5E7EB;border-radius:4px;overflow:hidden;">
        <div style="width:${pct}%;height:100%;background:${color};border-radius:4px;"></div>
      </div>
      <span style="font-size:9px;color:#6B7E72;width:28px;text-align:right;">${pct}%</span>
    </div>
  `;
}

export async function GET(request: NextRequest) {
  const property = getParam(request, 'property', 'Main Residence');
  const from = getParam(request, 'from', 'Jan 2026');
  const to = getParam(request, 'to', 'Sep 2026');
  const generatedAt = formatDate(new Date());

  const totalKwh = ENERGY_MONTHLY.reduce((s, r) => s + r.kwh, 0);
  const totalSolar = ENERGY_MONTHLY.reduce((s, r) => s + r.solar, 0);
  const totalGrid = ENERGY_MONTHLY.reduce((s, r) => s + r.grid, 0);
  const avgSolarPct = Math.round(ENERGY_MONTHLY.reduce((s, r) => s + r.solarPct, 0) / ENERGY_MONTHLY.length);
  const totalCost = ENERGY_MONTHLY.reduce((s, r) => s + parseInt(r.cost.replace(/[^0-9]/g, '')), 0);
  const co2Saved = Math.round(totalSolar * 0.00082 * 1000); // ~0.82 kg CO2 per kWh avoided

  const rows = ENERGY_MONTHLY.map(r => `
    <tr>
      <td><strong>${r.month}</strong></td>
      <td>${r.property}</td>
      <td style="text-align:right;">${r.kwh} kWh</td>
      <td style="text-align:right;color:#10B981;font-weight:600;">${r.solar} kWh</td>
      <td style="text-align:right;">${r.grid} kWh</td>
      <td>${bar(r.solarPct, '#10B981')}</td>
      <td style="text-align:right;font-weight:600;">${r.cost}</td>
    </tr>
  `).join('');

  const body = `
    <div class="info-grid" style="grid-template-columns: repeat(4,1fr);">
      <div class="info-card">
        <div class="value">${totalKwh.toLocaleString()} kWh</div>
        <div class="label">Total Consumed</div>
      </div>
      <div class="info-card" style="background:#ECFDF5;">
        <div class="value" style="color:#10B981;">${totalSolar.toLocaleString()} kWh</div>
        <div class="label">Solar Generated</div>
      </div>
      <div class="info-card">
        <div class="value">${avgSolarPct}%</div>
        <div class="label">Avg Solar Coverage</div>
      </div>
      <div class="info-card">
        <div class="value">GHS ${totalCost.toLocaleString()}</div>
        <div class="label">Total Energy Cost</div>
      </div>
    </div>

    <p class="section-title">Monthly Energy Consumption — ${from} to ${to}</p>
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th>Property</th>
          <th style="text-align:right;">Total (kWh)</th>
          <th style="text-align:right;">☀️ Solar</th>
          <th style="text-align:right;">⚡ Grid</th>
          <th style="width:160px;">Solar Coverage</th>
          <th style="text-align:right;">Cost (GHS)</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <!-- ESG / Sustainability Callout -->
    <div style="background:#ECFDF5;border:1px solid #A7F3D0;border-radius:8px;padding:16px;display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div>
        <p style="font-size:10px;font-weight:700;color:#064E3B;margin-bottom:8px;">🌿 ESG &amp; Carbon Footprint</p>
        <p style="font-size:10px;color:#047857;">
          Solar generation of <strong>${totalSolar.toLocaleString()} kWh</strong> this period avoided approximately
          <strong>${co2Saved} kg of CO₂</strong> emissions — equivalent to planting ~${Math.round(co2Saved / 21)} trees.
        </p>
      </div>
      <div>
        <p style="font-size:10px;font-weight:700;color:#064E3B;margin-bottom:8px;">💡 Cost Savings Estimate</p>
        <p style="font-size:10px;color:#047857;">
          Solar offset saved an estimated <strong>GHS ${Math.round(totalSolar * 0.8).toLocaleString()}</strong> in grid electricity costs
          over the reporting period at the current ECG tariff rate of GHS 0.80/kWh.
        </p>
      </div>
    </div>
  `;

  const html = buildReportHtml({
    title: 'Energy Consumption Report',
    subtitle: `Property: ${property}  ·  Period: ${from} – ${to}`,
    body,
    generatedAt,
  });

  return htmlResponse(html, `civitas-energy-report-${Date.now()}.html`);
}
