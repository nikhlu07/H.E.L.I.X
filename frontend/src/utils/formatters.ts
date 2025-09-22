// Indian number formatting utilities

export function formatIndianCurrency(amount: number): string {
  if (amount >= 10000000) { // 1 crore
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  }
  if (amount >= 100000) { // 1 lakh
    return `₹${(amount / 100000).toFixed(1)} L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatIndianNumber(num: number): string {
  return num.toLocaleString('en-IN');
}

export function formatIndianDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatIndianDateTime(date: Date): string {
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
}