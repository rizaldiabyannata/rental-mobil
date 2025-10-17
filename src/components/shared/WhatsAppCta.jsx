"use client";

import React, { useMemo, useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WhatsAppCta({
  carName,
  waUrlBase,
  messageTemplate,
  label = "Pesan via WhatsApp",
  // Icon can be a component (lucide) or a react node (Image)
  Icon = MessageCircle,
  // classes to customize button sizing / styling from caller
  buttonClassName = "bg-primary hover:bg-[#8FA6C3]",
  iconClassName = "h-4 w-4",
  anchorClassName = "inline-flex items-center gap-2",
}) {
  // Build a stable server-side href that doesn't include window-derived data to
  // avoid hydration mismatch. We'll compute the final href on the client.
  const baseHref = useMemo(() => {
    try {
      const base = new URL(waUrlBase);
      // Set a minimal text param that doesn't change between server and client.
      base.searchParams.set(
        "text",
        `Halo Admin, saya tertarik memesan${carName ? ` ${carName}` : ""}.`
      );
      return base.toString();
    } catch (e) {
      return waUrlBase;
    }
  }, [waUrlBase, carName]);

  const [href, setHref] = useState(baseHref);

  useEffect(() => {
    try {
      const base = new URL(waUrlBase);
      const pageUrl = window.location.href;
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
      setHref(base.toString());
    } catch (e) {
      // fallback: keep baseHref
      setHref(baseHref);
    }
  }, [carName, waUrlBase, messageTemplate, baseHref]);

  return (
    <Button asChild className={buttonClassName}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Buka WhatsApp untuk memesan${
          carName ? ` ${carName}` : ""
        }`}
        className={anchorClassName}
      >
        {/* render Icon: if it's already a React element, render it; otherwise render as a component */}
        {React.isValidElement(Icon) ? (
          Icon
        ) : (
          <Icon className={iconClassName} aria-hidden="true" />
        )}
        {label}
      </a>
    </Button>
  );
}
