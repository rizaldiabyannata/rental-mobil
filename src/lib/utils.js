import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format number into Indonesian Rupiah string, e.g., 650000 -> "Rp 650.000"
// Accepts number or numeric string. Use Intl for proper locale formatting.
export function formatIDR(value, options = {}) {
  const { withSymbol = true } = options;
  let n = 0;
  if (typeof value === "number") n = value;
  else if (typeof value === "string")
    n = Number(value.replace(/[^0-9.-]/g, "")) || 0;
  try {
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
    if (withSymbol) return formatted;
    return formatted.replace(/^Rp\s?/, "").trim();
  } catch {
    // Fallback simple formatting with thousand separators
    const s = Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return withSymbol ? `Rp ${s}` : s;
  }
}
