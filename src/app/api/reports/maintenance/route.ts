import type { NextRequest } from 'next/server';
import { buildReportHtml, htmlResponse, formatDate, getParam } from '@/lib/report-builder';

// In production: fetch from Supabase using getAuthedProfile() + DB queries.
// These stubs demonstrate the report structure; swap for live data.

const MAINTENANCE_RECORDS = [
  { date: '2026-09-13', property: 'Block A — Main Campus', category: 'Generator Service', description: '250 kVA Cummins oil change & filter replacement', technician: 'Emmanuel T.', duration: '3.5 hrs', status: 'Completed', cost: 'GHS 1,840' },
  { date: '2026-09-04', property: 'Medical Complex', category: 'Water Treatment', description: 'RO filter replacement & borehole pressure test', technician: 'Kofi A.', duration: '2 hrs', status: 'Completed', cost: 'GHS 620' },
  { date: '2026-08-28', property: 'Block A — Main Campus', category: 'HVAC Service', description: 'Daikin VRV refrigerant top-up & coil cleaning (8 units)', technician: 'Emmanuel T.', duration: '6 hrs', status: 'Completed', cost: 'GHS 3,200' },
  { date: '2026-08-14', property: 'Admin Tower', category: 'Elevator Maintenance', description: 'Kone lift quarterly inspection & brake pad check', technician: 'Kone GH Ltd', duration: '4 hrs', status: 'Completed', cost: 'GHS 2,100' },
  { date: '2026-08-01', property: 'Science Complex', category: 'Electrical', description: 'Main DB panel thermal imaging & phase balancing', technician: 'Kweku O.', duration: '3 hrs', status: 'Completed', cost: 'GHS 980' },
  { date: '2026-07-17', property: 'Block A — Main Campus', category: 'Fire Safety', description: 'Annual fire extinguisher servicing & sprinkler pressure test', technician: 'GNFA Certified Tech', duration: '5 hrs', status: 'Completed', cost: 'GHS 1,560' },
  { date: '2026-07-05', property: 'Student Hostels', category: 'Plumbing', description: 'Burst pipe repair, valve replacement (Wing C)', technician: 'Yaw B.', duration: '4.5 hrs', status: 'Completed', cost: 'GHS 740' },
  { date: '2026-06-21', property: 'Admin Tower', category: 'Generator Service', description: '150 kVA Perkins 500-hour major service', technician: 'Emmanuel T.', duration: '5 hrs', status: 'Completed', cost: 'GHS 2,380' },
];

export async function GET(request: NextRequest) {
  const property = getParam(request, 'property', 'All Properties');
  const from = getParam(request, 'from', '2026-01-01');
  const to = getParam(request, 'to', formatDate(new Date()));
  const generatedAt = formatDate(new Date());

  const totalCost = MAINTENANCE_RECORDS.reduce((sum, r) => {
    return sum + parseInt(r.cost.replace(/[^0-9]/g, ''));
  }, 0);

  const rows = MAINTENANCE_RECORDS.map(r => `
    <tr>
      <td>${r.date}</td>
      <td>${r.property}</td>
      <td><span class="badge badge-blue">${r.category}</span></td>
      <td style="max-width:220px;">${r.description}</td>
      <td>${r.technician}</td>
      <td>${r.duration}</td>
      <td><span class="badge badge-green">${r.status}</span></td>
      <td style="text-align:right;font-weight:600;">${r.cost}</td>
    </tr>
  `).join('');

  const body = `
    <div class="info-grid" style="grid-template-columns: repeat(4,1fr);">
      <div class="info-card">
        <div class="value">${MAINTENANCE_RECORDS.length}</div>
        <div class="label">Total Jobs</div>
      </div>
      <div class="info-card">
        <div class="value">${MAINTENANCE_RECORDS.filter(r => r.status === 'Completed').length}</div>
        <div class="label">Completed</div>
      </div>
      <div class="info-card">
        <div class="value">GHS ${totalCost.toLocaleString()}</div>
        <div class="label">Total Cost (period)</div>
      </div>
      <div class="info-card">
        <div class="value">100%</div>
        <div class="label">SLA Compliance</div>
      </div>
    </div>

    <p class="section-title">Maintenance Job Log — ${from} to ${to}</p>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Property / Location</th>
          <th>Category</th>
          <th>Description</th>
          <th>Technician</th>
          <th>Duration</th>
          <th>Status</th>
          <th style="text-align:right;">Cost</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div style="background:#F5F9F6;border-radius:8px;padding:14px;font-size:10px;color:#3D5044;">
      <strong>Summary:</strong> ${MAINTENANCE_RECORDS.length} maintenance jobs were completed across campus facilities between ${from} and ${to},
      with a total expenditure of <strong>GHS ${totalCost.toLocaleString()}</strong>. All jobs were completed within Civitas SLA response targets.
      Preventive maintenance accounted for ${Math.round((MAINTENANCE_RECORDS.filter(r => ['Generator Service','HVAC Service','Elevator Maintenance'].includes(r.category)).length / MAINTENANCE_RECORDS.length) * 100)}% of all dispatches.
    </div>
  `;

  const html = buildReportHtml({
    title: 'Maintenance History Report',
    subtitle: `Property: ${property}  ·  Period: ${from} – ${to}`,
    body,
    generatedAt,
  });

  return htmlResponse(html, `civitas-maintenance-report-${Date.now()}.html`);
}
