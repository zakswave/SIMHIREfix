export const formatCurrencyIDR = (value: number, compact = false): string => {
  if (compact) {
    if (value >= 1_000_000_000) return 'Rp ' + (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (value >= 1_000_000) return 'Rp ' + (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'Jt';
    if (value >= 1_000) return 'Rp ' + (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'Rb';
  }
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
};

export const formatNumber = (value: number): string => new Intl.NumberFormat('id-ID').format(value);
