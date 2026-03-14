const numberFormatter = new Intl.NumberFormat('en-US');
const compactNumberFormatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});
const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 0
});
const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit'
});
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric'
});

const statusLabelMap: Record<string, string> = {
  NEW: 'New',
  REVIEWED: 'Reviewed',
  QUALIFIED: 'Qualified',
  DRAFT_READY: 'Ready',
  SENT: 'Contacted',
  REPLIED: 'Replied',
  INTERESTED: 'Interested',
  MEETING: 'Meeting',
  WON: 'Won',
  LOST: 'Lost',
  DISCARDED: 'Discarded'
};

export function formatNumber(value?: number | null) {
  return numberFormatter.format(value ?? 0);
}

export function formatCompactNumber(value?: number | null) {
  return compactNumberFormatter.format(value ?? 0);
}

export function formatCurrency(value?: number | null) {
  return currencyFormatter.format(value ?? 0);
}

export function formatPercent(value?: number | null) {
  return percentFormatter.format(value ?? 0);
}

export function formatDateTime(value?: string | Date | null) {
  if (!value) {
    return 'Not available';
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return dateTimeFormatter.format(date);
}

export function formatShortDate(value?: string | Date | null) {
  if (!value) {
    return 'Not scheduled';
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Not scheduled';
  }

  return dateFormatter.format(date);
}

export function formatStatusLabel(value?: string | null) {
  if (!value) {
    return 'Unknown';
  }

  const normalized = value.toUpperCase();
  if (statusLabelMap[normalized]) {
    return statusLabelMap[normalized];
  }

  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function truncateValue(value?: string | null, length = 14) {
  if (!value) {
    return 'Unavailable';
  }

  return value.length <= length ? value : `${value.slice(0, length)}...`;
}

export function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function isSameDay(value: string | Date | null | undefined, comparison = new Date()) {
  if (!value) {
    return false;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.toDateString() === comparison.toDateString();
}

export function isOverdue(value: string | Date | null | undefined, comparison = new Date()) {
  if (!value) {
    return false;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.getTime() < comparison.getTime() && !isSameDay(date, comparison);
}
