import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import PageHero from "@/components/shared/PageHero";
import TourGallery from "@/components/tours/TourGallery";
import {
  TourInclusions,
  TourPriceMatrix,
} from "@/components/tours/TourDetails";
import WhatsAppCtaSection from "@/components/shared/WhatsAppCtaSection";
import { Badge } from "@/components/ui/badge";

const prisma = new PrismaClient();

// Generate static pages for better performance
export async function generateStaticParams() {
  const packages = await prisma.tourPackage.findMany({
    select: { slug: true },
  });
  return packages.map((pkg) => ({
    slug: pkg.slug,
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const tourPackage = await prisma.tourPackage.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true },
  });

  if (!tourPackage) {
    return {
      title: "Paket Tidak Ditemukan",
    };
  }

  return {
    title: `${tourPackage.name} | Paket Wisata Lombok`,
    description: tourPackage.description.substring(0, 160),
  };
}

async function getTourPackage(slug) {
  const tourPackage = await prisma.tourPackage.findUnique({
    where: { slug },
    include: {
      hotelTiers: {
        orderBy: { order: "asc" },
        include: {
          priceTiers: {
            orderBy: { price: "asc" },
          },
        },
      },
    },
  });

  if (!tourPackage) {
    notFound();
  }

  return tourPackage;
}

export default async function TourDetailPage({ params }) {
  const { slug } = await params;
  const tour = await getTourPackage(slug);

  // Compute minimal price across all tiers for quick highlight
  const minPrice = (() => {
    try {
      const prices = (tour?.hotelTiers || [])
        .flatMap((h) => h.priceTiers || [])
        .map((p) => p.price)
        .filter((n) => typeof n === "number" && !isNaN(n));
      if (!prices.length) return null;
      return Math.min(...prices);
    } catch {
      return null;
    }
  })();

  return (
    <main>
      <PageHero
        title={tour.name}
        subtitle={`Paket Wisata ${tour.duration}`}
        imageUrl={tour.galleryImages[0] || "/Hero-1.png"}
      />
      <div className="container mx-auto px-4 md:px-6 pt-0 md:pt-0 pb-10 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Left: Gallery & Details */}
          <div className="lg:col-span-8 space-y-8 xl:space-y-10 py-4 lg:py-8 xl:py-10">
            <section>
              <TourGallery images={tour.galleryImages} alt={tour.name} />
            </section>
            <section
              id="deskripsi"
              className="bg-white rounded-xl shadow-sm p-6 xl:p-8"
            >
              <h2 className="text-2xl xl:text-3xl font-semibold mb-4 xl:mb-6">
                Deskripsi Paket
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap text-base xl:text-lg">
                {tour.description}
              </p>
            </section>
            <section
              id="inklusi"
              className="bg-white rounded-xl shadow-sm p-6 xl:p-8"
            >
              <TourInclusions inclusions={tour.inclusions} />
              <section className="mt-4 lg:mt-8" id="harga">
                <TourPriceMatrix
                  hotelTiers={tour.hotelTiers}
                  showHotels={tour.showHotels}
                />
              </section>
            </section>
          </div>

          {/* Right: Sidebar */}
          <aside className="lg:col-span-4 mt-0 lg:mt-8 xl:mt-10">
            <div className="sticky top-24 space-y-6">
              <div className="p-6 xl:p-8 border rounded-xl shadow-md bg-white">
                <h2 className="text-2xl xl:text-3xl font-bold mb-1">
                  {tour.name}
                </h2>
                <Badge
                  variant="secondary"
                  className="text-base xl:text-lg py-1 px-3"
                >
                  {tour.duration}
                </Badge>
                {minPrice !== null && (
                  <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-100 p-4">
                    <p className="text-sm text-neutral-700">Mulai dari</p>
                    <p className="text-2xl font-extrabold text-emerald-700">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(minPrice)}
                      <span className="ml-1 text-sm font-medium text-neutral-600">
                        / orang
                      </span>
                    </p>
                  </div>
                )}
                <div className="mt-6">
                  <WhatsAppCtaSection
                    waUrlBase="https://wa.me/6287741861681"
                    imageSrc="/imageforctasection.png"
                    imageAlt={`Gallery`}
                    className="shadow-md rounded-2xl"
                    message={`Halo, saya tertarik dengan paket wisata \"${tour.name}\". Mohon informasinya.`}
                    imageVisible={false}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom CTA for mobile/tablet */}
        <div className="lg:hidden mt-10">
          <WhatsAppCtaSection
            waUrlBase="https://wa.me/6287741861681"
            imageSrc="/imageforctasection.png"
            imageAlt={`Gallery`}
            className="shadow-md rounded-2xl"
            message={`Halo, saya tertarik dengan paket wisata \"${tour.name}\". Mohon informasinya.`}
          />
        </div>
      </div>
    </main>
  );
}
