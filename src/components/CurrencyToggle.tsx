'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type Currency = 'GHS' | 'USD' | 'GBP' | 'EUR';

// Approximate indicative exchange rates: GHS per 1 unit of foreign currency
export const EXCHANGE_RATES: Record<Currency, number> = {
  GHS: 1,
  USD: 15.5,
  GBP: 19.8,
  EUR: 16.8,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GHS: 'GH₵',
  USD: '$',
  GBP: '£',
  EUR: '€',
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatAmount: (amountGhs: number, options?: { hideSymbol?: boolean; decimals?: number }) => string;
  convert: (amountGhs: number) => number;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'GHS',
  setCurrency: () => {},
  formatAmount: (n) => `GH₵ ${Number(n).toLocaleString()}`,
  convert: (n) => n,
  symbol: 'GH₵',
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('GHS');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('civitas_currency') as Currency;
      if (saved && (saved === 'GHS' || saved === 'USD' || saved === 'GBP' || saved === 'EUR')) {
        setCurrencyState(saved);
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem('civitas_currency', c);
    } catch {
      // LocalStorage unavailable
    }
  };

  const convert = (amountGhs: number): number => {
    const rate = EXCHANGE_RATES[currency] || 1;
    if (currency === 'GHS') return amountGhs;
    return amountGhs / rate;
  };

  const formatAmount = (
    amountGhs: number,
    options?: { hideSymbol?: boolean; decimals?: number }
  ): string => {
    const converted = convert(amountGhs);
    const decimals = options?.decimals ?? (currency === 'GHS' ? 0 : 0);
    const formatted = converted.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    if (options?.hideSymbol) return formatted;
    return `${CURRENCY_SYMBOLS[currency]} ${formatted}`;
  };

  const symbol = CURRENCY_SYMBOLS[currency];

  const value = useMemo(
    () => ({ currency, setCurrency, formatAmount, convert, symbol }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

export default function CurrencyToggle({ className = '' }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const currencies: Currency[] = ['GHS', 'USD', 'GBP', 'EUR'];

  return (
    <div
      className={`inline-flex items-center p-0.5 bg-[#EEF4F0] border border-[#D8E4DC] rounded-xl text-[11px] font-semibold ${className}`}
      title="Display currency (converted at indicative rate)"
    >
      {currencies.map((c) => {
        const active = currency === c;
        return (
          <button
            key={c}
            type="button"
            onClick={() => setCurrency(c)}
            className={`px-2 py-1 rounded-lg transition-all ${
              active
                ? 'bg-white text-[#0F3D26] shadow-xs font-bold'
                : 'text-[#6B7E72] hover:text-[#111A14]'
            }`}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}

export function CurrencyAmount({
  amountGhs,
  className = '',
  decimals,
  hideSymbol = false,
}: {
  amountGhs: number;
  className?: string;
  decimals?: number;
  hideSymbol?: boolean;
}) {
  const { formatAmount } = useCurrency();
  return <span className={className}>{formatAmount(amountGhs, { decimals, hideSymbol })}</span>;
}

