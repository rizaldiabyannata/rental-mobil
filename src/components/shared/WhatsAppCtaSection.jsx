"use client";

import React from "react";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import WhatsAppCta from "@/components/shared/WhatsAppCta";
import { cn } from "@/lib/utils";
import { ShieldCheck, Clock3, ThumbsUp } from "lucide-react";

const perks = [
  { icon: ShieldCheck, text: "Driver berpengalaman & ramah" },
  { icon: Clock3, text: "Respon cepat via WhatsApp" },
  { icon: ThumbsUp, text: "Jadwal fleksibel sesuai kebutuhan" },
];

export default function WhatsAppCtaSection({
  carName = undefined,
  waUrlBase,
  imageSrc = "/imageforctasection.png",
  imageAlt = "Armada siap berangkat",
  imageVisible = true,
  sectionHeadingText = "Siap Berangkat? Chat Kami Sekarang",
  sectionDescription = "Tanyakan ketersediaan armada dan dapatkan penawaran paket tour terbaik langsung via WhatsApp.",
  className,
  includePageLink, // optional override; if undefined, auto-exclusion applies in WhatsAppCta
}) {
  return (
    <section className={cn("w-full py-10 md:py-14 bg-neutral-50", className)}>
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 md:px-6 lg:px-8">
        <div
          className={cn(
            "grid grid-cols-1 gap-6 md:gap-10 items-center",
            imageVisible ? "md:grid-cols-2" : "md:grid-cols-1"
          )}
        >
          {/* Left: Text + CTA */}
          <div className={cn(!imageVisible && "mx-auto max-w-2xl")}>
            <SectionHeading
              title={sectionHeadingText}
              align={imageVisible ? "left" : "center"}
              size="lg"
              underline
              underlineColor="bg-amber-500"
              underlineWidth="lg"
              underlineOffset="sm"
              titleClassName="text-primary"
              underlineClassName="h-[3px] w-24 md:w-32 lg:w-40"
              className="mb-4"
              description={sectionDescription}
            />
            <p
              className={cn(
                "text-neutral-700 md:text-lg",
                !imageVisible && "text-center"
              )}
            >
              Tanyakan ketersediaan {carName ? <b>{carName}</b> : "armada"} dan
              dapatkan penawaran terbaik langsung via WhatsApp.
            </p>

            <ul
              className={cn(
                "mt-4 space-y-2",
                !imageVisible && "mx-auto max-w-md"
              )}
            >
              {perks.map((p, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-neutral-800"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#EFF7FF] text-primary">
                    <p.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm md:text-base">{p.text}</span>
                </li>
              ))}
            </ul>

            <div className={cn("mt-6", !imageVisible && "flex justify-center")}>
              {/* pass carName only if provided */}
              <WhatsAppCta
                {...(carName ? { carName } : {})}
                waUrlBase={waUrlBase}
                includePageLink={includePageLink}
              />
            </div>
          </div>
          {imageVisible && (
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <div className="relative w-full h-64 md:h-[360px] lg:h-[440px]">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority={false}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5 rounded-2xl" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
