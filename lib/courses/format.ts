import type { Money } from '../../types/courses';

/** "Free", "Rs 1,500" or "Rs 1,500.50". Lakh grouping, as NPR prices are written. */
export function formatMoney(money: Money | null): string {
  if (!money || money.amount <= 0) return 'Free';
  const rupees = money.amount / 100;
  return `Rs ${rupees.toLocaleString('en-IN', {
    minimumFractionDigits: Number.isInteger(rupees) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Paisa to the rupee string eSewa expects ("1500", or "1500.50"). It is part
 * of the signed message, so it must be byte-for-byte what is sent in the form.
 */
export function toRupeeString(paisa: number): string {
  if (!Number.isInteger(paisa) || paisa < 0) throw new Error(`Invalid amount: ${paisa}`);
  return paisa % 100 === 0 ? String(paisa / 100) : (paisa / 100).toFixed(2);
}

/** "2h 05m", "45m", or "" when unknown. */
export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return '';
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${String(rest).padStart(2, '0')}m`;
}
