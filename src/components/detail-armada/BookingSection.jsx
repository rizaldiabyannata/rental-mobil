"use client";

import React from "react";
import BookingForm from "@/components/detail-armada/BookingForm";
import { cn } from "@/lib/utils";

/**
 * BookingSection: mobile-first stacked; md+ splits into form (left) and image (right)
 * Props:
 * - carName?: string
 * - waUrlBase: string (e.g. https://wa.me/129129120)
 * - imageSrc?: string (default /car-1.jpg)
 * - imageAlt?: string
 * - className?: string
 */
export default function BookingSection({
  carName,
  waUrlBase,
  imageSrc = "/car-1.jpg",
  imageAlt = "",
  className,
}) {
  return (
    <section className={cn("w-full py-8 md:py-12", className)}>
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Form */}
          <div className="bg-black md:bg-transparent p-0 md:p-0">
            <BookingForm carName={carName} waUrlBase={waUrlBase} />
          </div>

          {/* Image */}
          <div className="relative h-64 md:h-auto rounded-xl overflow-hidden">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
