"use client";

import React from "react";
import SectionHeading from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

/**
 * SpecsSection
 * Figma-like section: Title with green text and amber underline, followed by
 * a clean list of specification rows separated by thin dividers.
 *
 * Props:
 * - title?: string (default: 'Spesifikasi Lengkap')
 * - items: Array<{ label: string; value: string | React.ReactNode }>
 * - align?: 'left'|'center' (default 'left')
 * - showDivider?: boolean (default true)
 * - className?: string
 */
export default function SpecsSection({
  title = "Spesifikasi Lengkap",
  items = [],
  align = "left",
  showDivider = true,
  className,
}) {
  return (
    <section className={cn("w-full py-8 md:py-12", className)}>
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 md:px-6 lg:px-8">
        {/* Mobile: heading centered; md+: follow align prop */}
        <SectionHeading
          title={title}
          align="center"
          size="md"
          underline
          underlineColor="bg-amber-500"
          underlineWidth="lg"
          underlineOffset="md"
          titleClassName="text-emerald-700"
          underlineClassName="h-[3px] w-24 md:w-32 lg:w-40"
          className={cn(
            align === "left" && "md:items-start md:text-left",
            align === "center" && "md:items-center md:text-center",
            align === "right" && "md:items-end md:text-right",
            "mb-6 md:mb-8"
          )}
        />

        <div className="mt-6 md:mt-10">
          <dl className="w-full">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  // Mobile: single column; md+: two-column (label/value)
                  "grid grid-cols-1 md:flex md:justify-between items-start py-4 md:py-5 md:pl-4 lg:pl-6",
                  showDivider &&
                    idx !== items.length - 1 &&
                    "border-b border-neutral-300/70"
                )}
              >
                <dt className="md:col-span-4 text-sm md:text-base text-neutral-700">
                  {item.label}
                </dt>
                <dd className="md:col-span-8 md:pl-6 mt-1 md:mt-0 text-base md:text-lg font-medium text-neutral-900">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
