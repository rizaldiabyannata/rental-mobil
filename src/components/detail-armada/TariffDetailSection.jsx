"use client";

import React from "react";
import SectionHeading from "@/components/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatIDR } from "@/lib/utils";

export default function TariffDetailSection({
  title = "Detail Tarif Lengkap",
  cards = [
    {
      key: "card-1",
      title: "Sewa Per 12 Jam",
      items: [
        { label: "Dengan Driver", price: "Rp 650.000" },
        { label: "Driver + BBM (Normal)", price: "Rp 800.000" },
        { label: "Driver + BBM (Highseason)", price: "Rp 1.200.000" },
        { label: "Over Time / Jam", price: "Rp 60.000" },
        { label: "Biaya Luar Rute", price: "Rp 125.000" },
      ],
    },
    {
      key: "card-2",
      title: "Antar Jemput Bandara",
      items: [
        { label: "Tujuan Mataram", price: "Rp 450.000" },
        { label: "Tujuan Senggigi", price: "Rp 550.000" },
        { label: "Tujuan Bangsal", price: "Rp 750.000" },
        { label: "Tujuan Kute", price: "Rp 500.000" },
      ],
    },
  ],
  className,
}) {
  return (
    <section className={cn("w-full py-8 md:py-12", className)}>
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 md:px-6 lg:px-8">
        {/* Heading mobile: center + underline tebal */}
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
          className="mb-6 md:mb-10"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {cards.map((card, idx) => (
            <Card
              key={card.key || idx}
              className="rounded-2xl border border-neutral-300 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            >
              <CardContent className="p-5 md:p-6">
                {/* Card Title */}
                {card.title ? (
                  <h3 className="text-lg md:text-xl font-extrabold text-neutral-900">
                    {card.title}
                  </h3>
                ) : null}

                {/* Top divider */}
                {card.showTopDivider !== false ? (
                  <div className={cn("h-px bg-neutral-300 mt-3 md:mt-4")}></div>
                ) : null}

                {/* Content */}
                <div className="mt-4 md:mt-5">
                  {card.content ? (
                    card.content
                  ) : Array.isArray(card.items) && card.items.length ? (
                    <div className="space-y-4">
                      {card.items.map((it, i) => {
                        if (typeof it === "string") {
                          return (
                            <div
                              key={i}
                              className="text-sm md:text-base text-neutral-800"
                            >
                              {it}
                            </div>
                          );
                        }
                        return (
                          <div
                            key={i}
                            className="flex items-center justify-between gap-4"
                          >
                            <span className="text-sm md:text-base text-neutral-800">
                              {it.label}
                            </span>
                            {it.price ? (
                              <span className="text-sm md:text-base font-extrabold text-neutral-900">
                                {typeof it.price === "number"
                                  ? formatIDR(it.price)
                                  : /\d/.test(String(it.price)) &&
                                    !String(it.price).trim().startsWith("Rp")
                                  ? formatIDR(String(it.price))
                                  : it.price}
                              </span>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
