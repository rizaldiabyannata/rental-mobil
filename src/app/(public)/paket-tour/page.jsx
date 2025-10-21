export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import SectionHeading from "@/components/SectionHeading";
import TourCard from "@/components/tours/TourCard";
import PageHero from "@/components/shared/PageHero";

async function getTourPackages() {
  let tourPackages = [];
  try {
    tourPackages = await prisma.tourPackage.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        name: true,
        slug: true,
        description: true,
        duration: true,
        inclusions: true,
        galleryImages: true,
        hotelTiers: {
          select: {
            priceTiers: {
              select: { price: true },
              orderBy: { price: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });
  } catch (e) {
    console.error("getTourPackages failed:", e?.message || e);
  }

  // Process to find the minimum price and format for the TourCard component
  // Prioritized inclusion points based on the provided image
  const inclusionPriority = [
    "hotel (sesuai pilihan) mobil full ac",
    "bbm driver",
    "local guide",
    "guide (merangkap jadi fotografer)",
    "makan siang 5x",
    "makan malam 4x",
    "parcel buah (day 1)",
    "kalung selamat datang (songket)",
    "mineral water",
    "private glash bottom boat",
    "snorkling gear (mask & life jaket)",
    "fotografer underwater",
    "premium dokumentasi by guide",
    "foto menggunakan baju adat sasak",
    "tiket masuk",
    "parkir",
  ];

  return tourPackages.map((pkg) => {
    let minPrice = null;
    // Only use priceTiers with paxRange '2-3 PAX'
    const prices = pkg.hotelTiers.flatMap((tier) =>
      (tier.priceTiers || [])
        .filter((p) => p.paxRange === "2-3 PAX")
        .map((p) => p.price)
    );
    if (prices.length > 0) {
      minPrice = Math.min(...prices);
    }

    // Find matching inclusion points (case-insensitive, partial match)
    let includes = [];
    if (Array.isArray(pkg.inclusions)) {
      const lowerInclusions = pkg.inclusions.map((i) =>
        typeof i === "string" ? i.toLowerCase() : ""
      );
      includes = inclusionPriority.filter((point) => {
        // Find if any inclusion contains the main keyword of the point
        const mainKeyword = point.split(" ")[0].toLowerCase();
        return lowerInclusions.some((inc) => inc.includes(mainKeyword));
      });
      // If not enough, fallback to first 4-5 inclusions
      if (includes.length < 4) {
        includes = lowerInclusions.slice(0, 5);
      } else {
        includes = includes.slice(0, 5);
      }
    }

    return {
      slug: pkg.slug,
      title: pkg.name,
      shortDescription: pkg.description,
      coverImage: pkg.galleryImages ? pkg.galleryImages[0] : null,
      durationText: pkg.duration, // Pass string duration for ribbon
      minPrice: minPrice,
      features: [], // Fallback icons if needed
      includes,
    };
  });
}

export default async function TourListPage() {
  const tours = await getTourPackages();
  return (
    <main>
      <PageHero
        title="Paket Wisata Pilihan"
        subtitle="Temukan petualangan tak terlupakan di Lombok dengan paket wisata eksklusif kami. Dirancang untuk memberikan pengalaman terbaik dengan harga yang kompetitif."
        imageUrl="/Hero-2.png"
      />
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title={"Semua Paket Wisata"}
            align="center"
            size="md"
            underline
            underlineColor="bg-amber-500"
            underlineWidth="lg"
            underlineOffset="md"
            titleClassName="text-primary"
            underlineClassName="h-[3px] w-24 md:w-32 lg:w-40"
            className="mb-6 md:mb-10"
            description={
              "Pilih paket yang paling sesuai dengan kebutuhan perjalanan Anda."
            }
          />
          {tours.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {tours.map((tour) => (
                <TourCard key={tour.slug} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>
                Saat ini belum ada paket wisata yang tersedia. Silakan periksa
                kembali nanti.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
