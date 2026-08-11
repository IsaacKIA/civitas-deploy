/**
 * Ghana Rent Act 220 (1963), Section 25 compliance engine.
 *
 * A landlord may not lawfully demand more than 6 months of rent in advance.
 * Civitas turns an unlawful "pay 2 years upfront" demand into:
 *   1. One legal upfront payment (min(requested, 6) months), payable now.
 *   2. A monthly rent schedule for every month beyond the legal cap — the
 *      tenant is never forced to pre-pay the illegal portion. Each of those
 *      months is simply billed as ordinary rent when it falls due.
 *
 * This file is the single source of truth for that math. Both the
 * marketing/estimate calculator (client-side, illustrative) and the real
 * lease-creation API route (server-side, authoritative) import it, so the
 * number a prospective tenant sees before signing is guaranteed to match
 * the number the backend actually bills.
 */

export const RENT_ACT_LEGAL_ADVANCE_MONTHS = 6;

export interface RentActPlanInstallment {
  installmentNumber: number;
  monthOffset: number; // months after lease start; 0 = due immediately
  dueDate: string; // ISO date
  amountGhs: number;
  kind: 'legal_advance' | 'monthly_rent';
}

export interface RentActPlan {
  monthlyRentGhs: number;
  advanceMonthsRequested: number;
  legalMonths: number;
  legalAdvanceAmountGhs: number;
  isNonCompliantDemand: boolean;
  protectedMonths: number;
  protectedAmountGhs: number; // informational: what the tenant is NOT forced to pre-pay
  installments: RentActPlanInstallment[];
}

/**
 * Builds a full payment schedule for a lease given the monthly rent and how
 * many months of advance rent the landlord originally asked for.
 *
 * @param monthlyRentGhs Agreed monthly rent in GHS. Must be > 0.
 * @param advanceMonthsRequested Months of advance rent the landlord requested.
 * @param leaseStartDate Lease start date; installment due dates are computed from this.
 * @param scheduleHorizonMonths How many months of ordinary post-cap rent to
 *   schedule installments for. Defaults to the full requested term so the
 *   tenant can see the whole picture; for a 1-year lease this is naturally
 *   capped by the lease length upstream.
 */
export function buildRentActPlan(
  monthlyRentGhs: number,
  advanceMonthsRequested: number,
  leaseStartDate: Date,
  scheduleHorizonMonths?: number
): RentActPlan {
  if (!(monthlyRentGhs > 0)) {
    throw new Error('monthlyRentGhs must be a positive number');
  }
  if (!Number.isInteger(advanceMonthsRequested) || advanceMonthsRequested < 1) {
    throw new Error('advanceMonthsRequested must be a positive integer');
  }

  const legalMonths = Math.min(advanceMonthsRequested, RENT_ACT_LEGAL_ADVANCE_MONTHS);
  const legalAdvanceAmountGhs = monthlyRentGhs * legalMonths;
  const isNonCompliantDemand = advanceMonthsRequested > RENT_ACT_LEGAL_ADVANCE_MONTHS;
  const protectedMonths = Math.max(0, advanceMonthsRequested - RENT_ACT_LEGAL_ADVANCE_MONTHS);
  const protectedAmountGhs = protectedMonths * monthlyRentGhs;

  const horizon = scheduleHorizonMonths ?? advanceMonthsRequested;

  const installments: RentActPlanInstallment[] = [];

  installments.push({
    installmentNumber: 1,
    monthOffset: 0,
    dueDate: leaseStartDate.toISOString(),
    amountGhs: legalAdvanceAmountGhs,
    kind: 'legal_advance',
  });

  for (let m = legalMonths; m < horizon; m++) {
    const dueDate = new Date(leaseStartDate);
    dueDate.setMonth(dueDate.getMonth() + m);
    installments.push({
      installmentNumber: installments.length + 1,
      monthOffset: m,
      dueDate: dueDate.toISOString(),
      amountGhs: monthlyRentGhs,
      kind: 'monthly_rent',
    });
  }

  return {
    monthlyRentGhs,
    advanceMonthsRequested,
    legalMonths,
    legalAdvanceAmountGhs,
    isNonCompliantDemand,
    protectedMonths,
    protectedAmountGhs,
    installments,
  };
}

export type MomoRail = 'mtn_momo' | 'telecel_cash' | 'at_money';

/** Ghana MoMo numbers: 9 digits after the +233 country code / leading 0. */
export function isValidGhanaMobileNumber(localNumber: string): boolean {
  const digits = localNumber.replace(/\D/g, '');
  return /^[0-9]{9}$/.test(digits);
}
