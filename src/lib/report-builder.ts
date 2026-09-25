import type { NextRequest } from 'next/server';

// Shared CSS injected into all PDF reports
const REPORT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; font-size: 11px; color: #111A14; background: #fff; padding: 0; }
  @page { margin: 20mm 18mm; size: A4; }
  @media print {
    .no-print { display: none !important; }
    .page-break { page-break-before: always; }
  }
  .page { max-width: 780px; margin: 0 auto; padding: 32px 0; }
  .header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #D8E4DC; }
  .logo-block .logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #064E3B; letter-spacing: -0.5px; }
  .logo-block .tagline { font-size: 9px; color: #6B7E72; margin-top: 2px; text-transform: uppercase; letter-spacing: 1px; }
  .report-meta { text-align: right; }
  .report-meta .report-title { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: #064E3B; }
  .report-meta .report-sub { font-size: 9px; color: #6B7E72; margin-top: 4px; }
  .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #064E3B; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #D8E4DC; }
  .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
  .info-card { background: #F5F9F6; border-radius: 8px; padding: 14px; }
  .info-card .value { font-size: 20px; font-weight: 700; color: #064E3B; font-family: 'Playfair Display', serif; }
  .info-card .label { font-size: 9px; color: #6B7E72; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 28px; font-size: 10px; }
  th { background: #064E3B; color: white; padding: 8px 10px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600; }
  td { padding: 8px 10px; border-bottom: 1px solid #D8E4DC; color: #3D5044; vertical-align: top; }
  tr:hover td { background: #F5F9F6; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 100px; font-size: 9px; font-weight: 700; }
  .badge-green { background: #D6EDE1; color: #064E3B; }
  .badge-yellow { background: #FEF3C7; color: #92400E; }
  .badge-red { background: #FEE2E2; color: #991B1B; }
  .badge-blue { background: #DBEAFE; color: #1E40AF; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #D8E4DC; display: flex; justify-content: space-between; font-size: 8px; color: #A8B8AE; }
  .print-btn { position: fixed; top: 20px; right: 20px; padding: 10px 22px; background: #064E3B; color: white; border: none; border-radius: 100px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: Inter, sans-serif; box-shadow: 0 4px 12px rgba(6,78,59,0.3); }
  .print-btn:hover { background: #0F3D26; }
`;

export function buildReportHtml({
  title,
  subtitle,
  body,
  generatedAt,
  generatedBy,
}: {
  title: string;
  subtitle: string;
  body: string;
  generatedAt: string;
  generatedBy?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — Civitas Report</title>
  <style>${REPORT_STYLES}</style>
</head>
<body>
  <button class="no-print print-btn" onclick="window.print()">🖨 Print / Save PDF</button>
  <div class="page">
    <div class="header">
      <div class="logo-block">
        <div class="logo">Civitas</div>
        <div class="tagline">Property &amp; Facilities Management · Ghana</div>
      </div>
      <div class="report-meta">
        <div class="report-title">${title}</div>
        <div class="report-sub">${subtitle}</div>
        <div class="report-sub" style="margin-top:6px;">Generated: ${generatedAt}${generatedBy ? ` &nbsp;|&nbsp; By: ${generatedBy}` : ''}</div>
      </div>
    </div>

    ${body}

    <div class="footer">
      <span>Civitas Property Services Ltd &nbsp;|&nbsp; RC: GH-2024-CIVITAS &nbsp;|&nbsp; civitas.com.gh</span>
      <span>Confidential — for recipient use only. Report ID: RPT-${Date.now()}</span>
    </div>
  </div>
  <script>
    // Auto-focus for keyboard-triggered print
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') { window.print(); }
    });
  </script>
</body>
</html>`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function htmlResponse(html: string, filename: string): Response {
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}

// Shared query-param parser
export function getParam(req: NextRequest, key: string, fallback = ''): string {
  return req.nextUrl.searchParams.get(key) ?? fallback;
}
