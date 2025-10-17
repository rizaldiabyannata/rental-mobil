import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import TourFeatureIcons from "./TourFeatureIcons";
import { FaUser, FaTicketAlt, FaUtensils, FaTint, FaCar } from "react-icons/fa";

export default function TourCard({ tour }) {
  const {
    slug = "",
    title = "Paket Tour",
    shortDescription = "",
    coverImage = "/imageforctasection.png",
    durationDays = 0,
    durationHours = 0,
    minPrice = null,
    features = [], // e.g. ["car", "beach", "group"]
    includes = [], // e.g. ["car","driver","ticket","meal","water"]
  } = tour || {};

  // Build duration label similar to reference (e.g., "2 HARI 1 MALAM")
  const nights = durationDays > 1 ? durationDays - 1 : 0;
  const durationText = durationDays
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

  // Includes section mapping
  const INCLUDE_LABELS = {
    car: "Mobil",
    driver: "Driver",
    ticket: "Tiket Wisata",
    meal: "Makan",
    water: "Air Mineral",
  };
  const INCLUDE_ICONS = {
    car: FaCar,
    driver: FaUser,
    ticket: FaTicketAlt,
    meal: FaUtensils,
    water: FaTint,
  };

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
        {/* Divider */}
        <div className="my-3 h-[2px] w-full bg-neutral-200" />

        {/* Includes or feature icons */}
        {includes && includes.length > 0 ? (
          <div>
            <div className="text-[11px] font-semibold uppercase text-neutral-600 mb-2">
              Include
            </div>
            <ul className="space-y-1">
              {includes.slice(0, 6).map((key, idx) => {
                const Icon = INCLUDE_ICONS[key] || FaCar;
                const label = INCLUDE_LABELS[key] || key;
                return (
                  <li
                    key={key + idx}
                    className="flex items-center gap-2 text-[13px] text-neutral-700"
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary border border-primary/20">
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="tracking-wide">{label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <TourFeatureIcons features={features} />
        )}

        {/* Footer: price per pax + button */}
        <div className="mt-4 flex items-center justify-between">
          {minPrice !== null ? (
            <div className="text-sm">
              <span className="font-bold text-primary">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(minPrice)}
              </span>
              <span className="ml-1 text-neutral-600">/ orang</span>
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
