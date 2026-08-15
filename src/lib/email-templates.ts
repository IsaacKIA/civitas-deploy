/**
 * Civitas Estate Management — Email Templates & Sender Library
 * High-deliverability inline-styled transactional HTML emails for Ghana PropTech.
 */

const BASE_STYLES = {
  container: `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5EBE7; box-shadow: 0 4px 20px rgba(15, 61, 38, 0.05);`,
  header: `background-color: #0F3D26; padding: 28px 36px; text-align: left;`,
  headerTitle: `margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;`,
  headerSubtitle: `color: #E87722; font-weight: 600;`,
  body: `padding: 36px 36px 28px; background-color: #ffffff;`,
  heading: `font-size: 24px; font-weight: 700; color: #0F3D26; margin: 0 0 16px; font-family: Georgia, serif; line-height: 1.25;`,
  paragraph: `font-size: 14px; line-height: 1.6; color: #3D5044; margin: 0 0 24px;`,
  buttonContainer: `text-align: center; margin: 32px 0;`,
  button: `display: inline-block; background-color: #1A5C3A; color: #ffffff !important; text-decoration: none; font-size: 13px; font-weight: 600; padding: 14px 34px; border-radius: 9999px; letter-spacing: 0.2px; text-align: center; box-shadow: 0 2px 8px rgba(26, 92, 58, 0.25);`,
  subtext: `font-size: 12px; color: #788A7F; line-height: 1.5; margin: 24px 0 0;`,
  card: `width: 100%; background-color: #F5F9F6; border: 1px solid #E2ECE5; border-radius: 16px; padding: 18px 22px; margin: 24px 0; border-collapse: collapse;`,
  cardLabel: `padding: 9px 0; color: #6B7E72; font-size: 13px; font-weight: 500; border-bottom: 1px solid #EAF2EC;`,
  cardValue: `padding: 9px 0; color: #111A14; font-size: 13px; font-weight: 600; text-align: right; border-bottom: 1px solid #EAF2EC;`,
  cardLabelLast: `padding: 9px 0; color: #6B7E72; font-size: 13px; font-weight: 500;`,
  cardValueLast: `padding: 9px 0; color: #111A14; font-size: 13px; font-weight: 600; text-align: right;`,
  footer: `background-color: #F8FAF9; padding: 24px 36px; border-top: 1px solid #EBF1ED; font-size: 11px; color: #788A7F; line-height: 1.6;`,
  footerLink: `color: #1A5C3A; text-decoration: underline; font-weight: 600;`,
};

function renderHeader() {
  return `
    <div style="${BASE_STYLES.header}">
      <h1 style="${BASE_STYLES.headerTitle}">
        Civitas <span style="${BASE_STYLES.headerSubtitle}">Estate Management</span>
      </h1>
    </div>
  `;
}

function renderFooter() {
  return `
    <div style="${BASE_STYLES.footer}">
      <p style="margin: 0 0 6px;">Civitas Estate Management · Mankessim, Central Region, Ghana</p>
      <p style="margin: 0;">This is an automated message. For help, contact <a href="mailto:admin@civitasestate.com" style="${BASE_STYLES.footerLink}">admin@civitasestate.com</a>.</p>
    </div>
  `;
}

/**
 * 1. Email Verification / Welcome Template
 */
export function renderVerificationEmail({
  name = 'there',
  confirmUrl,
  role = 'client',
}: {
  name?: string;
  confirmUrl: string;
  role?: string;
}) {
  const roleLabel = role === 'tenant' ? 'a tenant' : role === 'owner' || role === 'client' ? 'a property owner' : 'a partner';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Civitas</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #EDF3EF;">
  <div style="${BASE_STYLES.container}">
    ${renderHeader()}
    <div style="${BASE_STYLES.body}">
      <h2 style="${BASE_STYLES.heading}">Welcome to Civitas, ${name}</h2>
      <p style="${BASE_STYLES.paragraph}">
        Your account is set up as ${roleLabel}. Everything you do on Civitas — leases, rent payments, maintenance requests — is now one login away.
      </p>
      <div style="${BASE_STYLES.buttonContainer}">
        <a href="${confirmUrl}" target="_blank" style="${BASE_STYLES.button}">
          Confirm Email & Go to Dashboard →
        </a>
      </div>
      <p style="${BASE_STYLES.subtext}">
        If you didn't create this account, you can safely ignore this email.
      </p>
    </div>
    ${renderFooter()}
  </div>
</body>
</html>
  `;
}

/**
 * 2. Payment Confirmation / Receipt Template
 */
export function renderPaymentReceivedEmail({
  tenantName = 'Valued Tenant',
  propertyName,
  amountGhs,
  paymentType = 'Monthly Rent',
  date,
  reference,
  historyUrl = 'https://www.civitasestate.com/dashboard/tenant/rent',
}: {
  tenantName?: string;
  propertyName: string;
  amountGhs: number | string;
  paymentType?: string;
  date?: string;
  reference: string;
  historyUrl?: string;
}) {
  const formattedDate = date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const formattedAmount = typeof amountGhs === 'number' ? `GHS ${amountGhs.toLocaleString()}` : `GHS ${amountGhs}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Received</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #EDF3EF;">
  <div style="${BASE_STYLES.container}">
    ${renderHeader()}
    <div style="${BASE_STYLES.body}">
      <h2 style="${BASE_STYLES.heading}">Payment Received</h2>
      <p style="${BASE_STYLES.paragraph}">
        Hi ${tenantName}, we've confirmed your ${paymentType.toLowerCase()} payment for <strong>${propertyName}</strong>.
      </p>

      <table style="${BASE_STYLES.card}">
        <tr>
          <td style="${BASE_STYLES.cardLabel}">Amount</td>
          <td style="padding: 9px 0; color: #0F3D26; font-size: 16px; font-weight: 700; text-align: right; border-bottom: 1px solid #EAF2EC;">${formattedAmount}</td>
        </tr>
        <tr>
          <td style="${BASE_STYLES.cardLabel}">Property</td>
          <td style="${BASE_STYLES.cardValue}">${propertyName}</td>
        </tr>
        <tr>
          <td style="${BASE_STYLES.cardLabel}">Payment Type</td>
          <td style="${BASE_STYLES.cardValue}">${paymentType}</td>
        </tr>
        <tr>
          <td style="${BASE_STYLES.cardLabel}">Date</td>
          <td style="${BASE_STYLES.cardValue}">${formattedDate}</td>
        </tr>
        <tr>
          <td style="${BASE_STYLES.cardLabelLast}">Reference</td>
          <td style="padding: 9px 0; color: #111A14; font-size: 13px; font-family: monospace; font-weight: 600; text-align: right;">${reference}</td>
        </tr>
      </table>

      <div style="${BASE_STYLES.buttonContainer}">
        <a href="${historyUrl}" target="_blank" style="${BASE_STYLES.button}">
          View Full Payment History →
        </a>
      </div>
    </div>
    ${renderFooter()}
  </div>
</body>
</html>
  `;
}

/**
 * 3. Technician Job Dispatch Template
 */
export function renderJobAssignedEmail({
  technicianName = 'Kwame',
  priority = 'urgent',
  referenceCode = 'MR-2026-4821',
  title = 'Bathroom tap leaking badly',
  propertyName = 'Airport Residential Apt 3B',
  address = 'Airport Residential Area, Accra',
  category = 'Plumbing',
  responseTarget = '24h',
  jobUrl = 'https://www.civitasestate.com/dashboard/technician',
}: {
  technicianName?: string;
  priority?: string;
  referenceCode?: string;
  title: string;
  propertyName: string;
  address: string;
  category?: string;
  responseTarget?: string;
  jobUrl?: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Job Assigned</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #EDF3EF;">
  <div style="${BASE_STYLES.container}">
    ${renderHeader()}
    <div style="${BASE_STYLES.body}">
      <h2 style="${BASE_STYLES.heading}">New Job Assigned</h2>
      <p style="${BASE_STYLES.paragraph}">
        Hi ${technicianName}, you've been assigned a <strong>⚠️ ${priority}</strong> maintenance request.
      </p>

      <table style="${BASE_STYLES.card}">
        <tr>
          <td colspan="2" style="padding-bottom: 12px; border-bottom: 1px solid #EAF2EC;">
            <div style="font-size: 11px; font-weight: 700; color: #0F3D26; font-family: monospace; text-transform: uppercase; margin-bottom: 4px;">${referenceCode}</div>
            <div style="font-size: 15px; font-weight: 700; color: #111A14;">${title}</div>
          </td>
        </tr>
        <tr>
          <td style="${BASE_STYLES.cardLabel}">Property</td>
          <td style="${BASE_STYLES.cardValue}">${propertyName}</td>
        </tr>
        <tr>
          <td style="${BASE_STYLES.cardLabel}">Address</td>
          <td style="${BASE_STYLES.cardValue}">${address}</td>
        </tr>
        <tr>
          <td style="${BASE_STYLES.cardLabel}">Category</td>
          <td style="${BASE_STYLES.cardValue}">${category}</td>
        </tr>
        <tr>
          <td style="${BASE_STYLES.cardLabelLast}">Response Target</td>
          <td style="padding: 9px 0; color: #E87722; font-size: 14px; font-weight: 700; text-align: right;">${responseTarget}</td>
        </tr>
      </table>

      <div style="${BASE_STYLES.buttonContainer}">
        <a href="${jobUrl}" target="_blank" style="${BASE_STYLES.button}">
          View Job Details →
        </a>
      </div>
    </div>
    ${renderFooter()}
  </div>
</body>
</html>
  `;
}

/**
 * 4. New Lease Agreement Invitation (To Tenant)
 */
export function renderLeaseInviteEmail({
  tenantName = 'Tenant',
  landlordName = 'Your Landlord',
  propertyName,
  monthlyRentGhs,
  advanceMonths = 6,
  leaseUrl = 'https://www.civitasestate.com/dashboard/tenant/lease',
}: {
  tenantName?: string;
  landlordName?: string;
  propertyName: string;
  monthlyRentGhs: number | string;
  advanceMonths?: number;
  leaseUrl?: string;
}) {
  const formattedRent = typeof monthlyRentGhs === 'number' ? `GHS ${monthlyRentGhs.toLocaleString()}` : `GHS ${monthlyRentGhs}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lease Agreement Ready</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #EDF3EF;">
  <div style="${BASE_STYLES.container}">
    ${renderHeader()}
    <div style="${BASE_STYLES.body}">
      <h2 style="${BASE_STYLES.heading}">Lease Agreement Ready</h2>
      <p style="${BASE_STYLES.paragraph}">
        Hi ${tenantName}, ${landlordName} has created a new Ghana Rent Act 220 compliant lease agreement for <strong>${propertyName}</strong>.
      </p>

      <table style="${BASE_STYLES.card}">
        <tr>
          <td style="${BASE_STYLES.cardLabel}">Property</td>
          <td style="${BASE_STYLES.cardValue}">${propertyName}</td>
        </tr>
        <tr>
          <td style="${BASE_STYLES.cardLabel}">Monthly Rent</td>
          <td style="padding: 9px 0; color: #0F3D26; font-size: 15px; font-weight: 700; text-align: right; border-bottom: 1px solid #EAF2EC;">${formattedRent} / mo</td>
        </tr>
        <tr>
          <td style="${BASE_STYLES.cardLabel}">Advance Terms</td>
          <td style="${BASE_STYLES.cardValue}">${advanceMonths} Months (Legal Escrow)</td>
        </tr>
        <tr>
          <td style="${BASE_STYLES.cardLabelLast}">Escrow Protection</td>
          <td style="padding: 9px 0; color: #1A5C3A; font-size: 13px; font-weight: 600; text-align: right;">Ghana Rent Act 220 Protected ✓</td>
        </tr>
      </table>

      <div style="${BASE_STYLES.buttonContainer}">
        <a href="${leaseUrl}" target="_blank" style="${BASE_STYLES.button}">
          Review & Accept Lease →
        </a>
      </div>
    </div>
    ${renderFooter()}
  </div>
</body>
</html>
  `;
}

/**
 * 5. Rent Due Reminder Email (Rent Act 220 Escrow)
 */
export function renderRentDueReminderEmail({
  tenantName = 'Tenant',
  propertyName,
  amountGhs,
  dueDate,
  paymentUrl = 'https://www.civitasestate.com/dashboard/tenant/rent',
}: {
  tenantName?: string;
  propertyName: string;
  amountGhs: number | string;
  dueDate: string;
  paymentUrl?: string;
}) {
  const formattedAmount = typeof amountGhs === 'number' ? `GHS ${amountGhs.toLocaleString()}` : `GHS ${amountGhs}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rent Payment Reminder</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #EDF3EF;">
  <div style="${BASE_STYLES.container}">
    ${renderHeader()}
    <div style="${BASE_STYLES.body}">
      <h2 style="${BASE_STYLES.heading}">Upcoming Rent Payment</h2>
      <p style="${BASE_STYLES.paragraph}">
        Hi ${tenantName}, this is a friendly reminder that your rent installment for <strong>${propertyName}</strong> is due on <strong>${dueDate}</strong>.
      </p>

      <table style="${BASE_STYLES.card}">
        <tr>
          <td style="${BASE_STYLES.cardLabel}">Amount Due</td>
          <td style="padding: 9px 0; color: #0F3D26; font-size: 16px; font-weight: 700; text-align: right; border-bottom: 1px solid #EAF2EC;">${formattedAmount}</td>
        </tr>
        <tr>
          <td style="${BASE_STYLES.cardLabel}">Due Date</td>
          <td style="padding: 9px 0; color: #E87722; font-size: 13px; font-weight: 700; text-align: right; border-bottom: 1px solid #EAF2EC;">${dueDate}</td>
        </tr>
        <tr>
          <td style="${BASE_STYLES.cardLabelLast}">Payment Methods</td>
          <td style="${BASE_STYLES.cardValueLast}">MTN MoMo · Telecel · Card</td>
        </tr>
      </table>

      <div style="${BASE_STYLES.buttonContainer}">
        <a href="${paymentUrl}" target="_blank" style="${BASE_STYLES.button}">
          Pay Rent via Mobile Money →
        </a>
      </div>
    </div>
    ${renderFooter()}
  </div>
</body>
</html>
  `;
}

/**
 * 6. Maintenance Request Resolved Email
 */
export function renderMaintenanceResolvedEmail({
  recipientName = 'there',
  referenceCode,
  title,
  propertyName,
  technicianName = 'Assigned Technician',
  dashboardUrl = 'https://www.civitasestate.com/dashboard',
}: {
  recipientName?: string;
  referenceCode: string;
  title: string;
  propertyName: string;
  technicianName?: string;
  dashboardUrl?: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Maintenance Request Completed</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #EDF3EF;">
  <div style="${BASE_STYLES.container}">
    ${renderHeader()}
    <div style="${BASE_STYLES.body}">
      <h2 style="${BASE_STYLES.heading}">Issue Resolved ✓</h2>
      <p style="${BASE_STYLES.paragraph}">
        Hi ${recipientName}, the maintenance request for <strong>${propertyName}</strong> has been completed by ${technicianName}.
      </p>

      <table style="${BASE_STYLES.card}">
        <tr>
          <td style="${BASE_STYLES.cardLabel}">Ticket Code</td>
          <td style="padding: 9px 0; color: #111A14; font-family: monospace; font-size: 13px; font-weight: 700; text-align: right; border-bottom: 1px solid #EAF2EC;">${referenceCode}</td>
        </tr>
        <tr>
          <td style="${BASE_STYLES.cardLabel}">Issue</td>
          <td style="${BASE_STYLES.cardValue}">${title}</td>
        </tr>
        <tr>
          <td style="${BASE_STYLES.cardLabel}">Property</td>
          <td style="${BASE_STYLES.cardValue}">${propertyName}</td>
        </tr>
        <tr>
          <td style="${BASE_STYLES.cardLabelLast}">Status</td>
          <td style="padding: 9px 0; color: #1A5C3A; font-size: 13px; font-weight: 700; text-align: right;">Completed ✓</td>
        </tr>
      </table>

      <div style="${BASE_STYLES.buttonContainer}">
        <a href="${dashboardUrl}" target="_blank" style="${BASE_STYLES.button}">
          View Maintenance Status →
        </a>
      </div>
    </div>
    ${renderFooter()}
  </div>
</body>
</html>
  `;
}

/**
 * Universal Resend Email Dispatch Helper
 */
export async function sendBrandedEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[sendBrandedEmail] RESEND_API_KEY is not set');
    return { error: 'RESEND_API_KEY missing' };
  }

  const recipients = Array.isArray(to) ? to : [to];

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Civitas Estate <admin@civitasestate.com>',
      to: recipients,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('[sendBrandedEmail] Resend API error:', errorData);
    return { error: errorData };
  }

  const data = await res.json();
  return { success: true, data };
}
