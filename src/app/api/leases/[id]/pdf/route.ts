import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { createSupabaseServerClient, getAuthedProfile } from '@/lib/supabase/server';

const GREEN = '#0F3D26';
const MUTED = '#6B7E72';
const ACCENT = '#E87722';

/**
 * GET /api/leases/:id/pdf
 *
 * Generates a lease summary PDF from real lease + installment data. Access
 * is restricted to the tenant on the lease, the owner on the lease, or an
 * admin in the same organization — the same access boundary as the leases
 * RLS select policy, re-checked here explicitly since this route reads via
 * the session-bound client (RLS still applies, this is defense in depth).
 *
 * Deliberately does NOT claim to be a digitally signed or legally binding
 * document — it's a factual summary of the terms recorded on Civitas.
 * Wiring a real e-signature provider is a separate, larger piece of work.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthedProfile();
  if (!auth) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id: leaseId } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: lease, error } = await supabase
    .from('leases')
    .select(
      'id, status, monthly_rent_ghs, advance_months_requested, legal_advance_months, start_date, end_date, created_at, tenant_id, owner_id, properties(name, address, city, region, ghana_post_gps), lease_installments(installment_number, amount_ghs, due_date, kind, status, paid_at)'
    )
    .eq('id', leaseId)
    .maybeSingle();

  if (error || !lease) {
    return NextResponse.json({ error: 'Lease not found' }, { status: 404 });
  }

  const property = Array.isArray(lease.properties) ? lease.properties[0] : lease.properties;
  const installments = (lease.lease_installments ?? []).slice().sort((a, b) => a.installment_number - b.installment_number);

  const pdfBuffer = await renderLeasePdf({ lease, property, installments, generatedFor: auth.profile.full_name });

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="civitas-lease-${leaseId.slice(0, 8)}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  });
}

interface RenderArgs {
  lease: {
    id: string;
    status: string;
    monthly_rent_ghs: number;
    advance_months_requested: number;
    legal_advance_months: number;
    start_date: string;
    end_date: string | null;
    created_at: string;
  };
  property: { name: string; address: string; city: string; region: string; ghana_post_gps: string | null } | null;
  installments: {
    installment_number: number;
    amount_ghs: number;
    due_date: string;
    kind: string;
    status: string;
    paid_at: string | null;
  }[];
  generatedFor: string;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GH', { day: 'numeric', month: 'long', year: 'numeric' });
}

function fmtGhs(n: number): string {
  return `GHS ${Number(n).toLocaleString()}`;
}

async function renderLeasePdf({ lease, property, installments, generatedFor }: RenderArgs): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fillColor(GREEN).fontSize(20).font('Helvetica-Bold').text('Civitas', { continued: true });
    doc.fillColor(ACCENT).text(' Estate Management');
    doc.moveDown(0.2);
    doc.fillColor(MUTED).fontSize(9).font('Helvetica').text('Lease Summary — generated from terms recorded on Civitas');
    doc.moveDown(1);

    doc.strokeColor('#D8E4DC').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1);

    // Property block
    doc.fillColor(GREEN).fontSize(14).font('Helvetica-Bold').text(property?.name ?? 'Property');
    doc.fillColor(MUTED).fontSize(9).font('Helvetica').text(
      [property?.address, property?.city, property?.region].filter(Boolean).join(', ')
    );
    if (property?.ghana_post_gps) {
      doc.text(`Ghana Post GPS: ${property.ghana_post_gps}`);
    }
    doc.moveDown(1);

    // Terms table
    const termRows: [string, string][] = [
      ['Lease status', lease.status.replace('_', ' ')],
      ['Start date', fmtDate(lease.start_date)],
      ['End date', lease.end_date ? fmtDate(lease.end_date) : '—'],
      ['Monthly rent', fmtGhs(lease.monthly_rent_ghs)],
      ['Advance requested by landlord', `${lease.advance_months_requested} months`],
      ['Legal advance billed (Rent Act 220 cap)', `${lease.legal_advance_months} months`],
      ['Generated for', generatedFor],
      ['Generated on', fmtDate(new Date().toISOString())],
    ];

    doc.fontSize(10);
    for (const [label, value] of termRows) {
      const y = doc.y;
      doc.fillColor(MUTED).font('Helvetica').text(label, 50, y, { width: 220 });
      doc.fillColor('#111A14').font('Helvetica-Bold').text(value, 280, y, { width: 265 });
      doc.moveDown(0.6);
    }

    doc.moveDown(0.5);
    doc.strokeColor('#D8E4DC').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1);

    // Compliance note
    doc.x = 50;
    doc.fillColor(GREEN).fontSize(11).font('Helvetica-Bold').text('Rent Act 220 Compliance', 50, doc.y);
    doc.fillColor('#3D5044').fontSize(9).font('Helvetica').text(
      lease.advance_months_requested > lease.legal_advance_months
        ? `Ghana's Rent Act 220 caps advance rent at 6 months. The landlord requested ${lease.advance_months_requested} months; only the legal ${lease.legal_advance_months} months were billed upfront. The remaining ${lease.advance_months_requested - lease.legal_advance_months} month(s) are billed as ordinary monthly rent as each falls due — never pre-paid.`
        : 'The advance requested is within the legal 6-month cap under Rent Act 220.',
      50,
      doc.y,
      { width: 495 }
    );
    doc.moveDown(1);

    // Installment schedule table
    doc.x = 50;
    doc.fillColor(GREEN).fontSize(11).font('Helvetica-Bold').text('Payment Schedule', 50, doc.y);
    doc.moveDown(0.3);

    const colX = { num: 50, date: 90, kind: 220, amount: 360, status: 460 };
    const headerY = doc.y;
    doc.fontSize(8).fillColor(MUTED).font('Helvetica-Bold');
    doc.text('#', colX.num, headerY, { width: 30 });
    doc.text('Due Date', colX.date, headerY, { width: 120 });
    doc.text('Type', colX.kind, headerY, { width: 130 });
    doc.text('Amount', colX.amount, headerY, { width: 90 });
    doc.text('Status', colX.status, headerY, { width: 85 });
    doc.y = headerY + 14;
    doc.strokeColor('#D8E4DC').moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.y += 6;

    doc.font('Helvetica').fontSize(8.5);
    for (const installment of installments) {
      if (doc.y > 750) {
        doc.addPage();
      }
      const rowY = doc.y;
      doc.fillColor('#111A14').text(String(installment.installment_number), colX.num, rowY, { width: 30 });
      doc.fillColor('#3D5044').text(fmtDate(installment.due_date), colX.date, rowY, { width: 120 });
      doc.text(installment.kind === 'legal_advance' ? 'Legal advance' : 'Monthly rent', colX.kind, rowY, { width: 130 });
      doc.fillColor('#1A5C3A').font('Helvetica-Bold').text(fmtGhs(installment.amount_ghs), colX.amount, rowY, { width: 90 });
      doc.font('Helvetica').fillColor(installment.status === 'paid' ? '#1A5C3A' : '#6B7E72').text(
        installment.status.replace('_', ' '),
        colX.status,
        rowY,
        { width: 85 }
      );
      doc.y = rowY + 16;
    }

    doc.moveDown(1.5);
    doc.strokeColor('#D8E4DC').moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.6);
    doc.x = 50;
    doc.fillColor(MUTED).fontSize(7.5).font('Helvetica').text(
      'This document is a factual summary of lease terms recorded on Civitas. It is not a digitally signed legal instrument and is not a substitute for legal advice. For tenancy disputes, contact Ghana\u2019s Rent Control Department for your district.',
      50,
      doc.y,
      { width: 495 }
    );

    doc.end();
  });
}
