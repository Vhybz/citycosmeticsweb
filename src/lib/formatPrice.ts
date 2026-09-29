import { CURRENCY_SYMBOL } from '@/lib/productsData';

/**
 * Format a number as Ghanaian Cedi currency string.
 * Examples: formatPrice(850) => "GH₵850.00"
 *           formatPrice(1200) => "GH₵1,200.00"
 */
export function formatPrice(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
