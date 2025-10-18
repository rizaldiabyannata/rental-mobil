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
        // No need to fetch hotel tiers/prices for list view anymore
      },
    });
  } catch (e) {
    console.error("getTourPackages failed:", e?.message || e);
  }

  // Map to card data: no price, add durationText for ribbon
  return tourPackages.map((pkg) => {
    // Heuristic mapping of inclusions text to icon keys for card
    const includes = Array.isArray(pkg.inclusions)
      ? pkg.inclusions
          .map((i) => (typeof i === "string" ? i.toLowerCase() : ""))
          .reduce((acc, text) => {
            if (!text) return acc;
            if (text.includes("hotel")) acc.add("hotel");
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
              "Pilih mobil yang paling sesuai dengan kebutuhan perjalanan Anda."
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
