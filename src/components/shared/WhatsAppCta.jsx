"use client";

import React, { useMemo } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * WhatsAppCta: open WhatsApp with prefilled message
 * Props:
 * - carName?: string
 * - waUrlBase: string (e.g., https://wa.me/129129120/dadkadka)
 * - messageTemplate?: (ctx) => string  // optional client-side template
 * - label?: string (default: 'Pesan via WhatsApp')
 */
export default function WhatsAppCta({
  carName,
  waUrlBase,
  messageTemplate,
  label = "Pesan via WhatsApp",
}) {
  const href = useMemo(() => {
    const base = new URL(waUrlBase);
    const pageUrl = typeof window !== "undefined" ? window.location.href : "";
    const defaultMsg = [
      `Halo Admin, saya tertarik memesan${carName ? ` ${carName}` : ""}.`,
      pageUrl && `Link: ${pageUrl}`,
    ]
      .filter(Boolean)
      .join("\n");
    const text = messageTemplate
      ? messageTemplate({ carName, pageUrl })
      : defaultMsg;
    base.searchParams.set("text", text);
    return base.toString();
  }, [carName, waUrlBase, messageTemplate]);

  return (
    <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Buka WhatsApp untuk memesan${
          carName ? ` ${carName}` : ""
        }`}
        className="inline-flex items-center gap-2"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        {label}
      </a>
    </Button>
  );
}
