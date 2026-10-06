/**
 * Civitas — Paystack Payment Gateway Integration
 *
 * Implements real Ghana Mobile Money (MTN, Telecel, AT Money) and card checkout
 * flows, cryptographic webhook signature verification, and transaction status checks.
 */

import crypto from 'crypto';
import type { MomoRail } from '@/lib/escrow';

const PAYSTACK_API_BASE = 'https://api.paystack.co';

export interface PaystackInitializeOptions {
  email: string;
  amountGhs: number;
  reference?: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
  channels?: ('mobile_money' | 'card')[];
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackChargeOptions {
  email: string;
  amountGhs: number;
  phoneNumber: string;
  rail: MomoRail;
  reference?: string;
  metadata?: Record<string, unknown>;
}

export interface PaystackChargeResponse {
  status: boolean;
  message: string;
  data: {
    reference: string;
    status: 'send_otp' | 'pay_offline' | 'pending' | 'success' | 'failed';
    display_text?: string;
    gateway_response?: string;
    amount: number;
    currency: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number;
    gateway_response: string;
    paid_at: string;
    channel: string;
    currency: string;
    customer: {
      id: number;
      email: string;
    };
    metadata?: Record<string, unknown>;
  };
}

/**
 * Maps Civitas internal rails to Paystack Ghana MoMo provider codes.
 * MTN -> 'mtn', Telecel (Vodafone) -> 'vod', AT Money (AirtelTigo) -> 'tgo'
 */
export function mapRailToPaystackProvider(rail: MomoRail): 'mtn' | 'vod' | 'tgo' {
  switch (rail) {
    case 'mtn_momo':
      return 'mtn';
    case 'telecel_cash':
      return 'vod';
    case 'at_money':
      return 'tgo';
    default:
      return 'mtn';
  }
}

/**
 * Returns the configured Paystack secret key from environment.
 * Throws in production if not configured.
 */
export function getPaystackSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error('PAYSTACK_SECRET_KEY is not defined in environment variables.');
  }
  return key;
}

/**
 * Initializes a standard hosted checkout link with Paystack.
 */
export async function initializePaystackTransaction(
  opts: PaystackInitializeOptions
): Promise<PaystackInitializeResponse> {
  const secretKey = getPaystackSecretKey();
  const amountPesewas = Math.round(opts.amountGhs * 100);

  const res = await fetch(`${PAYSTACK_API_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email: opts.email,
      amount: amountPesewas,
      currency: 'GHS',
      reference: opts.reference,
      callback_url: opts.callbackUrl,
      channels: opts.channels ?? ['mobile_money', 'card'],
      metadata: opts.metadata,
    }),
  });

  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message || 'Failed to initialize Paystack transaction');
  }

  return json as PaystackInitializeResponse;
}

/**
 * Direct Ghana Mobile Money charge (triggers USSD push prompt on user's phone).
 */
export async function chargeMobileMoneyDirect(
  opts: PaystackChargeOptions
): Promise<PaystackChargeResponse> {
  const secretKey = getPaystackSecretKey();
  const amountPesewas = Math.round(opts.amountGhs * 100);
  const provider = mapRailToPaystackProvider(opts.rail);

  const res = await fetch(`${PAYSTACK_API_BASE}/charge`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email: opts.email,
      amount: amountPesewas,
      currency: 'GHS',
      reference: opts.reference,
      mobile_money: {
        phone: opts.phoneNumber,
        provider,
      },
      metadata: opts.metadata,
    }),
  });

  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message || 'Failed to initiate Mobile Money charge');
  }

  return json as PaystackChargeResponse;
}

/**
 * Verifies a transaction reference directly against Paystack API.
 */
export async function verifyPaystackTransaction(reference: string): Promise<PaystackVerifyResponse> {
  const secretKey = getPaystackSecretKey();

  const res = await fetch(`${PAYSTACK_API_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message || 'Failed to verify transaction with Paystack');
  }

  return json as PaystackVerifyResponse;
}

/**
 * Cryptographically verifies that an incoming webhook was sent by Paystack.
 */
export function verifyPaystackWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  if (!signatureHeader) return false;

  try {
    const secretKey = getPaystackSecretKey();
    const hash = crypto.createHmac('sha512', secretKey).update(rawBody).digest('hex');

    const expectedBuffer = Buffer.from(hash, 'utf-8');
    const headerBuffer = Buffer.from(signatureHeader, 'utf-8');

    if (expectedBuffer.length !== headerBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, headerBuffer);
  } catch {
    return false;
  }
}
