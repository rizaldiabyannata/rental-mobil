import React from "react";
import { cn } from "@/lib/utils";

/**
 * SectionHeading
 * A flexible, reusable section heading with optional eyebrow, subtitle/description,
 * and a colored underline bar (per Figma: "Jenis Layanan Kami").
 *
 * Props:
 * - as?: 'h1'|'h2'|'h3'|'h4' (default 'h2')
 * - title: React.ReactNode | string
 * - eyebrow?: string
 * - description?: React.ReactNode | string
 * - align?: 'left'|'center'|'right' (default 'center')
 * - size?: 'sm'|'md'|'lg' (default 'lg')
 * - underline?: boolean (default true)
 * - underlineWidth?: 'sm'|'md'|'lg'|'full' (default 'md')
 * - underlineColor?: string (Tailwind class for bg color; default 'bg-amber-500')
 * - underlineOffset?: 'sm'|'md'|'lg' (default 'sm')
 * - className?: string
 */
const sizeClasses = {
  sm: "text-xl md:text-2xl font-bold",
  md: "text-2xl md:text-3xl font-bold",
  lg: "text-3xl md:text-4xl font-extrabold",
};

const underlineWidthClasses = {
  sm: "w-16",
  md: "w-24",
  lg: "w-36",
  full: "w-full",
};

const offsetClasses = {
  sm: "mt-2",
  md: "mt-3",
  lg: "mt-4",
};

export default function SectionHeading({
  as: As = "h2",
  title,
  eyebrow,
  description,
  align = "center",
  size = "lg",
  underline = true,
  underlineWidth = "md",
  underlineColor = "bg-amber-500",
  underlineOffset = "sm",
  titleClassName,
  underlineClassName,
  className,
}) {
  const alignMap = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  return (
    <div className={cn("w-full flex flex-col", alignMap[align], className)}>
      {eyebrow ? (
        <span className="text-xs font-medium tracking-wide uppercase text-emerald-700">
          {eyebrow}
        </span>
      ) : null}

      {title ? (
        <As
          className={cn(
            sizeClasses[size],
            "leading-tight text-emerald-700",
            titleClassName
          )}
        >
          {title}
        </As>
      ) : null}

      {underline ? (
        <div
          className={cn(
            "relative flex",
            align === "left" && "justify-start",
            align === "center" && "justify-center",
            align === "right" && "justify-end",
            offsetClasses[underlineOffset]
          )}
        >
          <span
            className={cn(
              "h-1 rounded-full",
              underlineWidthClasses[underlineWidth],
              underlineColor,
              underlineClassName
            )}
          />
        </div>
      ) : null}

      {description ? (
        <p
          className={cn(
            "mt-3 text-sm md:text-base text-neutral-700 max-w-2xl",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
