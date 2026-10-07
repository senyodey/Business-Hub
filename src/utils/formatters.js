export function formatCurrency(amount, currency = "$") {
  const num = Number(amount) || 0;
  return `${currency}${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCompactCurrency(amount, currency = "$") {
  const num = Number(amount) || 0;
  if (Math.abs(num) >= 1000000) {
    return `${currency}${(num / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(num) >= 1000) {
    return `${currency}${(num / 1000).toFixed(1)}k`;
  }
  return `${currency}${num.toFixed(0)}`;
}

export function formatPercent(val) {
  const num = Number(val) || 0;
  return `${num > 0 ? "+" : ""}${num.toFixed(1)}%`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function getMonthName(monthNumber) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[monthNumber - 1] || "";
}
