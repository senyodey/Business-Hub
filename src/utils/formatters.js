export function formatCurrency(amount, currency = "GH₵") {
  const num = Number(amount) || 0;
  const isNegative = num < 0;
  const absFormatted = Math.abs(num).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const space = currency.length > 1 ? " " : "";
  return `${isNegative ? "-" : ""}${currency}${space}${absFormatted}`;
}

export function formatCompactCurrency(amount, currency = "GH₵") {
  const num = Number(amount) || 0;
  const isNegative = num < 0;
  const abs = Math.abs(num);
  const space = currency.length > 1 ? " " : "";
  let valStr;
  if (abs >= 1000000) {
    valStr = `${(abs / 1000000).toFixed(1)}M`;
  } else if (abs >= 1000) {
    valStr = `${(abs / 1000).toFixed(1)}k`;
  } else {
    valStr = abs.toFixed(0);
  }
  return `${isNegative ? "-" : ""}${currency}${space}${valStr}`;
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
