/**
 * Civitas — Notification Templates
 * SMS and WhatsApp message variants for all key platform events.
 *
 * Rules:
 * - SMS: ≤ 160 chars per segment. Keep it tight.
 * - WhatsApp: supports markdown (*bold*, _italic_, ~strike~). Max ~4096 chars.
 * - All messages must end with an opt-out instruction for SMS (regulatory).
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NotificationChannel = 'sms' | 'whatsapp' | 'email';

export type NotificationEvent =
  | 'rent_payment_confirmed'
  | 'rent_payment_overdue'
  | 'maintenance_request_received'
  | 'maintenance_request_assigned'
  | 'maintenance_request_completed'
  | 'lease_expiry_reminder'
  | 'inspection_scheduled'
  | 'document_expiry_warning'
  | 'sla_breach_alert'
  | 'work_order_dispatched'
  | 'technician_en_route'
  | 'handover_certificate_ready'
  | 'agent_delegation_accepted'
  | 'remittance_received';

export interface NotificationPayload {
  event: NotificationEvent;
  recipientName: string;
  /** Africa's Talking format: +233XXXXXXXXX */
  recipientPhone: string;
  recipientEmail?: string;
  channel: NotificationChannel;
  data: Record<string, string | number>;
}

export interface RenderedMessage {
  body: string;
  /** For WhatsApp structured messages — fallback for plain SMS */
  fallbackSms?: string;
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const BRAND = 'Civitas FM';
const SUPPORT = '+233 55 506 2589';

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

// ---------------------------------------------------------------------------
// SMS Templates  (≤ 160 chars per segment, no markdown)
// ---------------------------------------------------------------------------

const SMS: Record<NotificationEvent, (data: Record<string, string | number>) => string> = {
  rent_payment_confirmed: (d) =>
    `[${BRAND}] Rent confirmed: GHS ${d.amount} for ${d.property}. Ref: ${d.ref}. Thank you! Reply STOP to opt out.`,

  rent_payment_overdue: (d) =>
    `[${BRAND}] OVERDUE: GHS ${d.amount} rent for ${d.property} was due ${d.due_date}. Pay now or call ${SUPPORT}. Reply STOP to opt out.`,

  maintenance_request_received: (d) =>
    `[${BRAND}] Your maintenance request "${truncate(String(d.title), 30)}" (#${d.ref}) has been received. We'll confirm a technician shortly. Reply STOP to opt out.`,

  maintenance_request_assigned: (d) =>
    `[${BRAND}] Technician ${d.technician} assigned to "${truncate(String(d.title), 25)}" at ${d.property}. ETA: ${d.eta}. Reply STOP to opt out.`,

  maintenance_request_completed: (d) =>
    `[${BRAND}] Job #${d.ref} at ${d.property} marked COMPLETE. Rate your experience: ${d.rating_url} Reply STOP to opt out.`,

  lease_expiry_reminder: (d) =>
    `[${BRAND}] Your lease at ${d.property} expires in ${d.days_remaining} days (${d.expiry_date}). Login to renew: ${d.portal_url} Reply STOP to opt out.`,

  inspection_scheduled: (d) =>
    `[${BRAND}] Inspection scheduled for ${d.property} on ${d.date} at ${d.time}. Agent: ${d.agent_name}. Queries? Call ${SUPPORT}. Reply STOP to opt out.`,

  document_expiry_warning: (d) =>
    `[${BRAND}] COMPLIANCE: "${truncate(String(d.doc_name), 30)}" expires in ${d.days_remaining} days. Upload renewal in your Compliance Vault. Reply STOP to opt out.`,

  sla_breach_alert: (d) =>
    `[${BRAND}] ALERT: SLA breach risk for job #${d.ref} at ${d.property}. Target: ${d.target}. Elapsed: ${d.elapsed}. Escalating now. Reply STOP to opt out.`,

  work_order_dispatched: (d) =>
    `[${BRAND}] Work Order #${d.ref} dispatched to you at ${d.property}. Category: ${d.category}. Priority: ${d.priority}. Open app to accept. Reply STOP to opt out.`,

  technician_en_route: (d) =>
    `[${BRAND}] ${d.technician} is en route to ${d.property}. ETA: ${d.eta}. Contact: ${d.technician_phone}. Reply STOP to opt out.`,

  handover_certificate_ready: (d) =>
    `[${BRAND}] Handover certificate for Unit ${d.unit} (${d.project}) is ready for signature. Login: ${d.portal_url} Reply STOP to opt out.`,

  agent_delegation_accepted: (d) =>
    `[${BRAND}] ${d.agent_name} has accepted your agent delegation for ${d.property}. They'll manage on-ground ops. Reply STOP to opt out.`,

  remittance_received: (d) =>
    `[${BRAND}] Remittance received: ${d.currency} ${d.amount} (GHS ${d.ghs_amount}) for ${d.property}. Ref: ${d.ref}. Reply STOP to opt out.`,
};

// ---------------------------------------------------------------------------
// WhatsApp Templates (markdown supported, richer context)
// ---------------------------------------------------------------------------

const WHATSAPP: Record<NotificationEvent, (name: string, data: Record<string, string | number>) => string> = {
  rent_payment_confirmed: (name, d) => `
✅ *Payment Confirmed — Civitas FM*

Hi ${name},

Your rent payment has been successfully received.

📍 *Property:* ${d.property}
💰 *Amount:* GHS ${d.amount}
🗓️ *Date:* ${d.payment_date}
🔖 *Reference:* ${d.ref}

Your receipt is available in your Civitas dashboard. Thank you for paying on time!

_Civitas Estate Management · ${SUPPORT}_
_Reply STOP to opt out of WhatsApp notifications._
`.trim(),

  rent_payment_overdue: (name, d) => `
⚠️ *Rent Overdue — Action Required*

Hi ${name},

Your rent payment for *${d.property}* is overdue.

💰 *Amount Due:* GHS ${d.amount}
📅 *Due Date:* ${d.due_date}
📆 *Days Overdue:* ${d.days_overdue}

Please pay via Mobile Money or bank transfer as soon as possible to avoid penalties.

📞 Need help? Call ${SUPPORT}
🌐 Pay online: ${d.portal_url}

_Reply STOP to opt out._
`.trim(),

  maintenance_request_received: (name, d) => `
🔧 *Maintenance Request Received*

Hi ${name},

We've received your maintenance request. Here are the details:

📋 *Job:* ${d.title}
🏠 *Property:* ${d.property}
🆔 *Reference:* #${d.ref}
⚡ *Priority:* ${d.priority}

Our team is reviewing your request. You'll receive another notification once a technician is assigned.

📞 Urgent? Call ${SUPPORT}

_Civitas FM · Reply STOP to opt out._
`.trim(),

  maintenance_request_assigned: (name, d) => `
👷 *Technician Assigned*

Hi ${name},

A Civitas technician has been assigned to your job.

📋 *Job:* ${d.title}
🏠 *Property:* ${d.property}
👤 *Technician:* ${d.technician}
⏰ *Expected Arrival:* ${d.eta}
📞 *Technician Contact:* ${d.technician_phone}

Please ensure someone is available at the property. Track progress in your dashboard.

_Civitas FM · Reply STOP to opt out._
`.trim(),

  maintenance_request_completed: (name, d) => `
✅ *Job Completed*

Hi ${name},

Maintenance job *#${d.ref}* at *${d.property}* has been marked complete.

📋 *Work Done:* ${d.summary}
⏱️ *Duration:* ${d.duration}
🔧 *Technician:* ${d.technician}

Please rate your experience (takes 30 seconds):
⭐ ${d.rating_url}

Your feedback helps us maintain service excellence.

_Civitas FM · Reply STOP to opt out._
`.trim(),

  lease_expiry_reminder: (name, d) => `
📄 *Lease Expiry Reminder*

Hi ${name},

Your tenancy agreement for *${d.property}* is due to expire soon.

📅 *Expiry Date:* ${d.expiry_date}
⏳ *Days Remaining:* ${d.days_remaining} days

To avoid interruption, please contact us to discuss renewal or vacating arrangements.

🌐 Login to your portal: ${d.portal_url}
📞 Call us: ${SUPPORT}

_Civitas FM · Reply STOP to opt out._
`.trim(),

  inspection_scheduled: (name, d) => `
📸 *Inspection Scheduled*

Hi ${name},

A property inspection has been scheduled.

🏠 *Property:* ${d.property}
📅 *Date:* ${d.date}
🕐 *Time:* ${d.time}
👤 *Inspector / Agent:* ${d.agent_name}
📞 *Agent Contact:* ${d.agent_phone}

Please ensure access is available. Photos and a report will be shared within 24 hours.

_Civitas FM · Reply STOP to opt out._
`.trim(),

  document_expiry_warning: (name, d) => `
⚠️ *Compliance Document Expiring*

Hi ${name},

A compliance certificate in your vault is due to expire soon.

📋 *Document:* ${d.doc_name}
📅 *Expiry Date:* ${d.expiry_date}
⏳ *Days Remaining:* ${d.days_remaining} days
🏢 *Issued By:* ${d.issuer}

Please upload a renewal immediately to maintain compliance.

🌐 Compliance Vault: ${d.portal_url}
📞 Support: ${SUPPORT}

_Civitas FM · Reply STOP to opt out._
`.trim(),

  sla_breach_alert: (name, d) => `
🚨 *SLA BREACH ALERT — Escalation Triggered*

Hi ${name},

A service level agreement is at risk of breach.

🆔 *Job Reference:* #${d.ref}
🏠 *Location:* ${d.property}
⏱️ *SLA Target:* ${d.target}
🕐 *Time Elapsed:* ${d.elapsed}
📋 *Category:* ${d.category}

Our operations team has been automatically notified and is escalating right now.

📞 Emergency line: ${SUPPORT}

_Civitas FM · Reply STOP to opt out._
`.trim(),

  work_order_dispatched: (name, d) => `
📋 *New Work Order — Action Required*

Hi ${name},

A work order has been assigned to you.

🆔 *WO Reference:* #${d.ref}
🏠 *Location:* ${d.property} ${d.unit ? `(${d.unit})` : ''}
🔧 *Category:* ${d.category}
⚡ *Priority:* ${d.priority}
🕐 *Respond By:* ${d.respond_by}

Please open the Civitas app to *Accept* or *Request Reassignment*.

📞 Ops contact: ${SUPPORT}

_Civitas FM — Technician Portal · Reply STOP to opt out._
`.trim(),

  technician_en_route: (name, d) => `
🚗 *Technician On the Way*

Hi ${name},

Great news — your Civitas technician is en route to your property.

👤 *Technician:* ${d.technician}
📞 *Direct Contact:* ${d.technician_phone}
⏰ *ETA:* ${d.eta}
🏠 *Property:* ${d.property}

Please ensure access is available on arrival.

_Civitas FM · Reply STOP to opt out._
`.trim(),

  handover_certificate_ready: (name, d) => `
🏗️ *Handover Certificate Ready*

Hi ${name},

Your unit handover certificate is ready for your signature.

🏙️ *Project:* ${d.project}
🏠 *Unit:* ${d.unit}
📋 *Reference:* ${d.ref}
📅 *Sign By:* ${d.deadline}

Please login to your developer portal to review and sign digitally.

🌐 ${d.portal_url}
📞 Questions? ${SUPPORT}

_Civitas FM · Reply STOP to opt out._
`.trim(),

  agent_delegation_accepted: (name, d) => `
🤝 *Agent Delegation Confirmed*

Hi ${name},

Your local agent has accepted the delegation for your property.

👤 *Agent:* ${d.agent_name}
📞 *Agent Contact:* ${d.agent_phone}
🏠 *Property:* ${d.property}
📅 *Effective:* ${d.effective_date}

${d.agent_name} will now manage on-ground operations on your behalf. You can monitor activity in your Diaspora Owner dashboard.

🌐 ${d.portal_url}

_Civitas FM · Reply STOP to opt out._
`.trim(),

  remittance_received: (name, d) => `
💱 *Remittance Received*

Hi ${name},

An overseas payment for your property has been received.

💰 *Amount:* ${d.currency} ${d.amount}
🔄 *GHS Equivalent:* GHS ${d.ghs_amount}
🏠 *Property:* ${d.property}
🔖 *Reference:* ${d.ref}
📅 *Date:* ${d.payment_date}

Your payment history is available in your Diaspora Owner dashboard.

_Civitas FM · Reply STOP to opt out._
`.trim(),
};

// ---------------------------------------------------------------------------
// Public renderer
// ---------------------------------------------------------------------------

export function renderNotification(payload: NotificationPayload): RenderedMessage {
  const { event, recipientName, channel, data } = payload;

  if (channel === 'sms') {
    return { body: SMS[event](data) };
  }

  if (channel === 'whatsapp') {
    const waBody = WHATSAPP[event](recipientName, data);
    const smsFallback = SMS[event](data);
    return { body: waBody, fallbackSms: smsFallback };
  }

  // 'email' channel — caller handles via email-templates.ts
  return { body: '' };
}
