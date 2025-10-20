"use client";

import CarCard from "./CarCard";
import SectionHeading from "@/components/SectionHeading";
import { useTranslations } from "next-intl";

const FleetSectionContent = ({ carsData }) => {
  const t = useTranslations("homepage.fleet");

  // Local uploads mapping
  function getImageUrl(src) {
    if (!src) return "/InnovaReborn.png";
    if (typeof src !== "string") return "/InnovaReborn.png";
    if (/^https?:\/\//i.test(src)) return src; // external URL
    let out = src.trim();
    // Remove accidental leading 'public/' prefix
    if (out.toLowerCase().startsWith("public/")) {
      out = out.slice(6);
    }
    // Ensure leading slash only; do NOT force '/uploads'
    if (!out.startsWith("/")) out = `/${out}`;
    // Collapse duplicate slashes
    out = out.replace(/\/{2,}/g, "/");
    return out;
  }

  // Map API data ke format yang dibutuhkan CarCard
  const cars = carsData.map((car) => {
    // Ambil image: prioritas gallery order 0, fallback coverImage, terakhir placeholder
    let image = "/InnovaReborn.png"; // default placeholder
    if (Array.isArray(car.gallery) && car.gallery.length > 0) {
      const firstImage =
        car.gallery.find((img) => img.order === 0) || car.gallery[0];
      if (firstImage?.url) {
        image = getImageUrl(firstImage.url);
      }
    } else if (car.coverImage) {
      image = getImageUrl(car.coverImage);
    }

    return {
      slug: car.slug,
      name: car.name,
      description:
        car.description || "Kendaraan berkualitas untuk perjalanan Anda.",
      image,
      price: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(car.startingPrice || 0),
      specs: [
        { icon: "Seat", label: `${car.capacity || 0} Seat` },
        { icon: "Fuel", label: car.fuelType || "Bensin" },
        { icon: "Type", label: car.transmission || "Manual" },
      ],
    };
  });

  return (
    <section id="armada" className="w-full md:pt-10 py-16">
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 sm:px-6 md:px-6 lg:px-8">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <SectionHeading
            title={t("title")}
            align="center"
            size="md"
            underline
            underlineColor="bg-amber-500"
            underlineWidth="lg"
            underlineOffset="md"
            titleClassName="text-primary"
            underlineClassName="h-[3px] w-24 md:w-32 lg:w-40"
            className="mb-6 md:mb-10"
            description={t("description")}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {cars.length > 0 ? (
            cars.map((car, index) => (
              <CarCard key={car.slug || index} car={car} />
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-600 py-8">
              {t("empty")}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const FleetSection = ({ carsData }) => {
  return <FleetSectionContent carsData={carsData} />;
};

export default FleetSection;
