/**
 * Civitas Estate Management — Email Templates Library
 * High-deliverability inline-styled transactional HTML emails.
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
  card: `background-color: #F5F9F6; border: 1px solid #E2ECE5; border-radius: 16px; padding: 20px 24px; margin: 24px 0;`,
  cardRow: `display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #EAF2EC; font-size: 13px;`,
  cardLabel: `color: #6B7E72; font-weight: 500;`,
  cardValue: `color: #111A14; font-weight: 600; text-align: right;`,
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

      <table style="width: 100%; background-color: #F5F9F6; border: 1px solid #E2ECE5; border-radius: 16px; padding: 18px 22px; margin: 24px 0; border-collapse: collapse;">
        <tr>
          <td style="padding: 9px 0; color: #6B7E72; font-size: 13px; font-weight: 500; border-bottom: 1px solid #EAF2EC;">Amount</td>
          <td style="padding: 9px 0; color: #0F3D26; font-size: 16px; font-weight: 700; text-align: right; border-bottom: 1px solid #EAF2EC;">${formattedAmount}</td>
        </tr>
        <tr>
          <td style="padding: 9px 0; color: #6B7E72; font-size: 13px; font-weight: 500; border-bottom: 1px solid #EAF2EC;">Property</td>
          <td style="padding: 9px 0; color: #111A14; font-size: 13px; font-weight: 600; text-align: right; border-bottom: 1px solid #EAF2EC;">${propertyName}</td>
        </tr>
        <tr>
          <td style="padding: 9px 0; color: #6B7E72; font-size: 13px; font-weight: 500; border-bottom: 1px solid #EAF2EC;">Payment Type</td>
          <td style="padding: 9px 0; color: #111A14; font-size: 13px; font-weight: 600; text-align: right; border-bottom: 1px solid #EAF2EC;">${paymentType}</td>
        </tr>
        <tr>
          <td style="padding: 9px 0; color: #6B7E72; font-size: 13px; font-weight: 500; border-bottom: 1px solid #EAF2EC;">Date</td>
          <td style="padding: 9px 0; color: #111A14; font-size: 13px; font-weight: 600; text-align: right; border-bottom: 1px solid #EAF2EC;">${formattedDate}</td>
        </tr>
        <tr>
          <td style="padding: 9px 0; color: #6B7E72; font-size: 13px; font-weight: 500;">Reference</td>
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

      <table style="width: 100%; background-color: #F5F9F6; border: 1px solid #E2ECE5; border-radius: 16px; padding: 20px 22px; margin: 24px 0; border-collapse: collapse;">
        <tr>
          <td colspan="2" style="padding-bottom: 12px; border-bottom: 1px solid #EAF2EC;">
            <div style="font-size: 11px; font-weight: 700; color: #0F3D26; font-family: monospace; text-transform: uppercase; margin-bottom: 4px;">${referenceCode}</div>
            <div style="font-size: 15px; font-weight: 700; color: #111A14;">${title}</div>
          </td>
        </tr>
        <tr>
          <td style="padding: 9px 0; color: #6B7E72; font-size: 13px; font-weight: 500; border-bottom: 1px solid #EAF2EC;">Property</td>
          <td style="padding: 9px 0; color: #111A14; font-size: 13px; font-weight: 600; text-align: right; border-bottom: 1px solid #EAF2EC;">${propertyName}</td>
        </tr>
        <tr>
          <td style="padding: 9px 0; color: #6B7E72; font-size: 13px; font-weight: 500; border-bottom: 1px solid #EAF2EC;">Address</td>
          <td style="padding: 9px 0; color: #111A14; font-size: 13px; font-weight: 600; text-align: right; border-bottom: 1px solid #EAF2EC;">${address}</td>
        </tr>
        <tr>
          <td style="padding: 9px 0; color: #6B7E72; font-size: 13px; font-weight: 500; border-bottom: 1px solid #EAF2EC;">Category</td>
          <td style="padding: 9px 0; color: #111A14; font-size: 13px; font-weight: 600; text-align: right; border-bottom: 1px solid #EAF2EC;">${category}</td>
        </tr>
        <tr>
          <td style="padding: 9px 0; color: #6B7E72; font-size: 13px; font-weight: 500;">Response Target</td>
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
