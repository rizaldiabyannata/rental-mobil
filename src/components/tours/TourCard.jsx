import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import TourFeatureIcons from "./TourFeatureIcons";
import {
  FaUser,
  FaTicketAlt,
  FaUtensils,
  FaTint,
  FaCar,
  FaHotel,
  FaCamera,
} from "react-icons/fa";

export default function TourCard({ tour }) {
  if (!tour) return null;
  const {
    slug = "",
    title = "Paket Tour",
    description = "",
    coverImage = "/imageforctasection.png",
    durationText: durationTextProp,
    durationDays = 0,
    durationHours = 0,
    minPrice = null,
    features = [], // e.g. ["car", "beach", "group"]
    includes: rawIncludes = [], // e.g. ["car","driver","ticket","meal","water"]
  } = tour;

  // Always ensure includes is array or string
  const includes = Array.isArray(rawIncludes)
    ? rawIncludes
    : typeof rawIncludes === "string"
    ? rawIncludes.split(/,\s*/)
    : [];

  // Build duration label similar to reference (e.g., "2 HARI 1 MALAM")
  const nights = durationDays > 1 ? durationDays - 1 : 0;
  const durationText = durationTextProp
    ? durationTextProp
    : durationDays
    ? `${durationDays} HARI${nights ? ` ${nights} MALAM` : ""}`
    : durationHours
    ? `${durationHours} JAM`
    : "";

  // Helper to map to local uploads URL
  function getImageUrl(src) {
    if (!src) return "/imageforctasection.png";
    if (typeof src !== "string") return "/imageforctasection.png";
    if (/^https?:\/\//i.test(src)) return src;
    let out = src.trim();
    if (out.toLowerCase().startsWith("public/")) {
      out = out.slice(6);
    }
    if (!out.startsWith("/")) out = `/${out}`;
    out = out.replace(/\/{2,}/g, "/");
    return out;
  }

  // Only show these fixed includes on the card
  const CARD_INCLUDES = [
    {
      keys: ["mobil", "car", "full ac"],
      label: "MOBIL",
      icon: FaCar,
    },
    {
      keys: ["driver", "bbm", "sopir"],
      label: "DRIVER",
      icon: FaUser,
    },
    {
      keys: [
        "dokumentasi",
        "dokumentation",
        "documentation",
        "foto",
        "photo",
        "kamera",
        "camera",
        "premium dokumentasi",
      ],
      label: "DOKUMENTATION",
      icon: FaCamera,
    },
    {
      keys: ["makan", "food", "siang", "malam", "parcel", "mineral", "air"],
      label: "FOOD & MINERAL WATER",
      icon: FaUtensils,
    },
    {
      keys: ["snorkling", "snorkel", "mask", "life jaket", "underwater"],
      label: "TOOLS SNORKLING",
      icon: FaTint,
    },
    {
      keys: ["tiket", "ticket", "wisata", "parkir"],
      label: "TIKET WISATA",
      icon: FaTicketAlt,
    },
  ];

  // Find matching includes from tour.includes
  function getCardIncludes(includes) {
    let lowerIncludes = [];
    if (Array.isArray(includes)) {
      lowerIncludes = includes.map((i) =>
        typeof i === "string" ? i.toLowerCase() : ""
      );
    } else if (typeof includes === "string") {
      lowerIncludes = includes.split(/,\s*/).map((i) => i.toLowerCase());
    }
    // Only show the fixed 5 main features, in order
    const allowedLabels = [
      "MOBIL",
      "DRIVER",
      "DOKUMENTATION",
      "FOOD & MINERAL WATER",
      "TOOLS SNORKLING",
    ];
    // Custom matching for FOOD & MINERAL WATER and TOOLS SNORKLING
    const result = [];
    // MOBIL
    if (lowerIncludes.some((inc) => inc.includes("mobil"))) {
      result.push(CARD_INCLUDES.find((i) => i.label === "MOBIL"));
    }
    // DRIVER
    if (
      lowerIncludes.some(
        (inc) =>
          inc.includes("driver") || inc.includes("bbm") || inc.includes("sopir")
      )
    ) {
      result.push(CARD_INCLUDES.find((i) => i.label === "DRIVER"));
    }
    // DOKUMENTATION
    if (
      lowerIncludes.some(
        (inc) =>
          inc.includes("dokumentasi") ||
          inc.includes("dokumentation") ||
          inc.includes("documentation") ||
          inc.includes("foto") ||
          inc.includes("photo") ||
          inc.includes("kamera") ||
          inc.includes("camera") ||
          inc.includes("premium dokumentasi")
      )
    ) {
      result.push(CARD_INCLUDES.find((i) => i.label === "DOKUMENTATION"));
    }
    // FOOD & MINERAL WATER
    if (
      lowerIncludes.some(
        (inc) =>
          inc.includes("makan") ||
          inc.includes("food") ||
          inc.includes("siang") ||
          inc.includes("malam") ||
          inc.includes("parcel") ||
          inc.includes("mineral") ||
          inc.includes("air")
      )
    ) {
      result.push(
        CARD_INCLUDES.find((i) => i.label === "FOOD & MINERAL WATER")
      );
    }
    // TOOLS SNORKLING
    if (
      lowerIncludes.some(
        (inc) =>
          inc.includes("snorkling") ||
          inc.includes("snorkel") ||
          inc.includes("mask") ||
          inc.includes("life jaket") ||
          inc.includes("underwater")
      )
    ) {
      result.push(CARD_INCLUDES.find((i) => i.label === "TOOLS SNORKLING"));
    }
    // TIKET WISATA
    if (
      lowerIncludes.some(
        (inc) =>
          inc.includes("tiket") ||
          inc.includes("ticket") ||
          inc.includes("wisata") ||
          inc.includes("parkir")
      )
    ) {
      result.push(CARD_INCLUDES.find((i) => i.label === "TIKET WISATA"));
    }
    return result.slice(0, 6);
  }

  return (
    <Card className="overflow-hidden border border-primary/20 shadow-md pt-0">
      <div className="aspect-[16/9] relative bg-neutral-100">
        <Link href={`/paket-tour/${slug}`} className="block" aria-label={title}>
          <Image
            src={getImageUrl(coverImage)}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </Link>
        {durationText ? (
          <div className="absolute right-2 top-2 z-10 rounded bg-primary px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow">
            {durationText}
          </div>
        ) : null}
      </div>
      <CardContent className="p-4">
        <Link href={`/paket-tour/${slug}`} className="block">
          <h3 className="text-base md:text-lg font-extrabold uppercase text-primary">
            {title}
          </h3>
        </Link>
        <div className="my-3 h-[2px] w-full bg-neutral-200" />

        {includes && includes.length > 0 ? (
          <div>
            <div className="text-[11px] font-semibold uppercase text-neutral-600 mb-2">
              Include
            </div>
            <ul className="space-y-1">
              {getCardIncludes(includes).map((item, idx) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.label + idx}
                    className="flex items-center gap-2 text-[13px] text-neutral-700"
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary border border-primary/20">
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="tracking-wide">{item.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            {description
              ? description.slice(0, 80) +
                (description.length > 80 ? "..." : "")
              : ""}
          </div>
        )}

        {/* Footer: price per pax + button */}
        <div className="mt-4 flex items-center justify-between">
          {minPrice !== null ? (
            <div className="text-sm">
              <div className="text-xs text-neutral-600 leading-none mb-1">
                Mulai dari
              </div>
              <div>
                <span className="font-bold text-primary">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(minPrice)}{" "}
                  / 2-3 PAX
                </span>
              </div>
            </div>
          ) : (
            <div />
          )}
          <Button
            asChild
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            <Link href={`/paket-tour/${slug}`}>Lihat Detail</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
