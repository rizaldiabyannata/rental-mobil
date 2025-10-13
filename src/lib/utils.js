import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format number of rupiah to ID locale currency string.
// Accepts number or numeric string; returns e.g., "Rp 1.200.000".
export function formatIDR(value) {
  if (value == null || value === "") return "";
  // If string like "Rp 1.200.000" already, try to normalize to digits
  const normalized =
    typeof value === "string"
      ? value
          .replace(/[^0-9,-]/g, "") // keep digits and separators
          .replace(/,(\d{2})$/, ".$1") // convert decimal comma to dot
      : value;

  const num =
    typeof normalized === "number"
      ? normalized
      : Number(normalized.replace(/\./g, ""));
  if (!Number.isFinite(num)) return String(value);

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}
