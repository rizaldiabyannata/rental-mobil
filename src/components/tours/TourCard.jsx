import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import TourFeatureIcons from "./TourFeatureIcons";

const MINIO_PUBLIC_URL =
  process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000";
const MINIO_BUCKET = process.env.NEXT_PUBLIC_MINIO_BUCKET || "uploads";

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
  } = tour || {};

  const durationText = durationDays
    ? `${durationDays} Hari${durationHours ? ` ${durationHours} Jam` : ""}`
    : durationHours
    ? `${durationHours} Jam`
    : "";

  // Helper to get MinIO image URL
  function getImageUrl(src) {
    if (!src) return "/imageforctasection.png";
    if (/^https?:\/\//i.test(src)) return src;
    // If already starts with bucket, don't double it
    if (src.startsWith("/")) src = src.slice(1);
    if (src.startsWith(MINIO_BUCKET + "/")) {
      return `${MINIO_PUBLIC_URL}/${src}`;
    }
    return `${MINIO_PUBLIC_URL}/${MINIO_BUCKET}/${src}`;
  }

  return (
    <Card className="overflow-hidden border border-emerald-100 shadow-md pt-0">
      <a href={`/paket-tour/${slug}`} className="block focus:outline-none">
        <div className="aspect-[16/9] relative bg-neutral-100">
          <Image
            src={getImageUrl(coverImage)}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-emerald-800">{title}</h3>
          <TourFeatureIcons features={features} />
          {shortDescription ? (
            <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
              {shortDescription}
            </p>
          ) : null}
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-neutral-700">{durationText}</span>
            {minPrice !== null ? (
              <span className="font-bold text-emerald-700">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(minPrice)}
              </span>
            ) : null}
          </div>
        </CardContent>
      </a>
    </Card>
  );
}
