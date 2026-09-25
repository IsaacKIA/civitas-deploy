import type { NextRequest } from 'next/server';
import { buildReportHtml, htmlResponse, formatDate, getParam } from '@/lib/report-builder';

// Stub data — replace with Supabase queries in production
const PAYMENT_RECORDS = [
  { date: '2026-09-01', tenant: 'Mr. Kwame Asante', unit: 'Unit 4A', property: '14 Labone Close', type: 'Monthly Rent', amount: 'GHS 3,200', method: 'Mobile Money', ref: 'TXN-9920', status: 'Paid' },
  { date: '2026-09-01', tenant: 'Ms. Abena Owusu', unit: 'Unit 2B', property: '14 Labone Close', type: 'Monthly Rent', amount: 'GHS 2,800', method: 'Bank Transfer', ref: 'TXN-9921', status: 'Paid' },
  { date: '2026-09-01', tenant: 'Dr. Kofi Mensah', unit: 'Apt 12', property: '7 Osu Ring Road', type: 'Monthly Rent', amount: 'GHS 4,500', method: 'Mobile Money', ref: 'TXN-9922', status: 'Paid' },
  { date: '2026-09-05', tenant: 'Mrs. Ama Tetteh', unit: 'Unit 1C', property: '14 Labone Close', type: 'Monthly Rent', amount: 'GHS 3,000', method: 'Mobile Money', ref: 'TXN-9923', status: 'Late' },
  { date: '2026-08-01', tenant: 'Mr. Kwame Asante', unit: 'Unit 4A', property: '14 Labone Close', type: 'Monthly Rent', amount: 'GHS 3,200', method: 'Mobile Money', ref: 'TXN-9800', status: 'Paid' },
  { date: '2026-08-01', tenant: 'Ms. Abena Owusu', unit: 'Unit 2B', property: '14 Labone Close', type: 'Monthly Rent', amount: 'GHS 2,800', method: 'Bank Transfer', ref: 'TXN-9801', status: 'Paid' },
  { date: '2026-08-01', tenant: 'Dr. Kofi Mensah', unit: 'Apt 12', property: '7 Osu Ring Road', type: 'Monthly Rent', amount: 'GHS 4,500', method: 'Mobile Money', ref: 'TXN-9802', status: 'Paid' },
  { date: '2026-08-03', tenant: 'Mrs. Ama Tetteh', unit: 'Unit 1C', property: '14 Labone Close', type: 'Monthly Rent', amount: 'GHS 3,000', method: 'Mobile Money', ref: 'TXN-9803', status: 'Paid' },
  { date: '2026-09-10', tenant: 'Mr. Kwame Asante', unit: 'Unit 4A', property: '14 Labone Close', type: 'Service Charge', amount: 'GHS 380', method: 'Mobile Money', ref: 'TXN-9930', status: 'Paid' },
  { date: '2026-09-12', tenant: 'Dr. Kofi Mensah', unit: 'Apt 12', property: '7 Osu Ring Road', type: 'Water Bill', amount: 'GHS 210', method: 'Mobile Money', ref: 'TXN-9931', status: 'Paid' },
];

export async function GET(request: NextRequest) {
  const property = getParam(request, 'property', 'All Properties');
  const from = getParam(request, 'from', '2026-08-01');
  const to = getParam(request, 'to', formatDate(new Date()));
  const generatedAt = formatDate(new Date());

  const totalGhs = PAYMENT_RECORDS.reduce((sum, r) => sum + parseInt(r.amount.replace(/[^0-9]/g, '')), 0);
  const paid = PAYMENT_RECORDS.filter(r => r.status === 'Paid').length;
  const late = PAYMENT_RECORDS.filter(r => r.status === 'Late').length;
  const outstanding = PAYMENT_RECORDS.filter(r => r.status === 'Outstanding').length;

  const rows = PAYMENT_RECORDS.map(r => {
    const badgeClass = r.status === 'Paid' ? 'badge-green' : r.status === 'Late' ? 'badge-yellow' : 'badge-red';
    return `
      <tr>
        <td>${r.date}</td>
        <td>${r.tenant}</td>
        <td>${r.unit}</td>
        <td>${r.property}</td>
        <td><span class="badge badge-blue">${r.type}</span></td>
        <td style="text-align:right;font-weight:600;">${r.amount}</td>
        <td>${r.method}</td>
        <td style="font-family:monospace;font-size:9px;">${r.ref}</td>
        <td><span class="badge ${badgeClass}">${r.status}</span></td>
      </tr>
    `;
  }).join('');

  const body = `
    <div class="info-grid" style="grid-template-columns: repeat(4,1fr);">
      <div class="info-card">
        <div class="value">GHS ${totalGhs.toLocaleString()}</div>
        <div class="label">Total Collected</div>
      </div>
      <div class="info-card">
        <div class="value">${paid}</div>
        <div class="label">Payments Received</div>
      </div>
      <div class="info-card">
        <div class="value" style="color:#D97706;">${late}</div>
        <div class="label">Late Payments</div>
      </div>
      <div class="info-card">
        <div class="value" style="color:#DC2626;">${outstanding}</div>
        <div class="label">Outstanding</div>
      </div>
    </div>

    <p class="section-title">Rent &amp; Payment Ledger — ${from} to ${to}</p>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Tenant</th>
          <th>Unit</th>
          <th>Property</th>
          <th>Type</th>
          <th style="text-align:right;">Amount</th>
          <th>Method</th>
          <th>Reference</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div style="background:#F5F9F6;border-radius:8px;padding:14px;font-size:10px;color:#3D5044;">
      <strong>Summary:</strong> GHS ${totalGhs.toLocaleString()} collected across ${PAYMENT_RECORDS.length} transactions from ${from} to ${to}.
      ${paid > 0 ? `${paid} payments received on time. ` : ''}
      ${late > 0 ? `<strong style="color:#D97706;">${late} late payment${late > 1 ? 's' : ''} recorded.</strong> ` : ''}
      ${outstanding > 0 ? `<strong style="color:#DC2626;">${outstanding} payment${outstanding > 1 ? 's' : ''} outstanding.</strong>` : ''}
    </div>
  `;

  const html = buildReportHtml({
    title: 'Financial & Rent Payment Report',
    subtitle: `Property: ${property}  ·  Period: ${from} – ${to}`,
    body,
    generatedAt,
  });

  return htmlResponse(html, `civitas-financials-report-${Date.now()}.html`);
}
