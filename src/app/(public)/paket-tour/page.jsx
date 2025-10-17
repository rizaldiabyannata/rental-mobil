import { PrismaClient } from "@prisma/client";
import SectionHeading from "@/components/SectionHeading";
import TourCard from "@/components/tours/TourCard";
import PageHero from "@/components/shared/PageHero";

const prisma = new PrismaClient();

async function getTourPackages() {
  const tourPackages = await prisma.tourPackage.findMany({
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
            select: {
              price: true,
            },
            orderBy: {
              price: "asc",
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  // Process to find the minimum price and format for the TourCard component
  return tourPackages.map((pkg) => {
    let minPrice = null;
    const prices = pkg.hotelTiers.flatMap((tier) =>
      tier.priceTiers.map((p) => p.price)
    );
    if (prices.length > 0) {
      minPrice = Math.min(...prices);
    }

    // Heuristic mapping of inclusions text to icon keys for card
    const includes = Array.isArray(pkg.inclusions)
      ? pkg.inclusions
          .map((i) => (typeof i === "string" ? i.toLowerCase() : ""))
          .reduce((acc, text) => {
            if (!text) return acc;
            if (text.includes("mobil")) acc.add("car");
            if (text.includes("driver") || text.includes("sopir"))
              acc.add("driver");
            if (text.includes("tiket")) acc.add("ticket");
            if (
              text.includes("makan") ||
              text.includes("lunch") ||
              text.includes("meal")
            )
              acc.add("meal");
            if (text.includes("air") || text.includes("mineral"))
              acc.add("water");
            return acc;
          }, new Set())
      : new Set();

    return {
      slug: pkg.slug,
      title: pkg.name,
      shortDescription: pkg.description,
      coverImage: pkg.galleryImages ? pkg.galleryImages[0] : null,
      durationText: pkg.duration, // Pass string duration for ribbon
      minPrice: minPrice,
      features: [], // Fallback icons if needed
      includes: Array.from(includes),
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
            title="Semua Paket Wisata"
            align="center"
            className="mb-8 md:mb-12"
            description="Pilih paket yang paling sesuai dengan gaya perjalanan Anda."
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
