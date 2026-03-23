import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Currency } from './../types/finance';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: Currency = 'USD') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Converts an amount between currencies based on the USD-CDF exchange rate.
 * We assume USD is the base currency.
 * @param amount The amount to convert
 * @param from The source currency
 * @param to The target currency
 * @param rate The exchange rate (1 USD = X CDF)
 */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  rate: number
): number {
  if (from === to) return amount;

  // Convert to USD first
  let amountInUSD = amount;
  if (from === 'CDF') {
    amountInUSD = amount / rate;
  } else if (from === 'EUR') {
    // For simplicity, let's assume 1 EUR = 1.1 USD if no other rate provided
    // But usually EUR isn't the focus of exchange rate settings in these regions
    amountInUSD = amount * 1.08; 
  }

  // Convert from USD to target
  if (to === 'USD') {
    return amountInUSD;
  } else if (to === 'CDF') {
    return amountInUSD * rate;
  } else if (to === 'EUR') {
    return amountInUSD / 1.08;
  }

  return amount;
}