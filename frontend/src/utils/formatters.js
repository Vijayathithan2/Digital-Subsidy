/**
 * Formats a number or string amount into Indian Rupee format (₹ xx,xx,xxx.xx)
 */
export const formatCurrencyINR = (amount) => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₹ 0.00';
  }
  const num = Number(amount);
  return '₹ ' + num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Formats an ISO date string to readable Indian date (e.g. 15 Aug 2026)
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return String(dateString);
  }
};

/**
 * Formats an ISO date string to readable Date and Time (e.g. 15 Aug 2026, 02:45 PM)
 */
export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '-';
  try {
    const d = new Date(dateTimeString);
    if (isNaN(d.getTime())) return String(dateTimeString);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return String(dateTimeString);
  }
};

/**
 * Formats a ratio or percentage to 2 decimal places with % sign
 */
export const formatPercentage = (val) => {
  if (val === null || val === undefined || isNaN(Number(val))) return '0.00%';
  return `${Number(val).toFixed(2)}%`;
};

/**
 * Truncates string with ellipsis if exceeding maxLength
 */
export const truncateText = (text, maxLength = 60) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
