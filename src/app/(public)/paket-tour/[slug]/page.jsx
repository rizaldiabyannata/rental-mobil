import TourItinerary from "@/components/tours/TourItinerary";
import TourMeta from "@/components/tours/TourMeta";
import TourPriceTable from "@/components/tours/TourPriceTable";
import WhatsAppCtaSection from "@/components/shared/WhatsAppCtaSection";
import SectionHeading from "@/components/SectionHeading";

// Placeholder fetcher: replace with /api/public/tours/[slug]
async function getTour(slug) {
  return {
    slug,
    title: "Explore Mataram",
    shortDescription: "City tour Mataram & kuliner lokal",
    longDescription: "Nikmati perjalanan sehari penuh di kota Mataram...",
    coverImage: "/Hero-1.png",
    durationDays: 1,
    inclusions: ["Driver", "BBM", "Parkir"],
    exclusions: ["Tiket masuk", "Makan"],
    itinerary: [
      {
        day: 1,
        title: "City Tour",
        items: ["Museum", "Taman Sangkareang", "Kuliner malam"],
      },
    ],
    priceTiers: [
      {
        name: "Dengan Driver",
        paxMin: 1,
        paxMax: 4,
        carName: "Avanza",
        price: 650000,
      },
      {
        name: "All-in",
        paxMin: 1,
        paxMax: 4,
        carName: "Avanza",
        price: 850000,
      },
    ],
  };
}

export default async function TourDetailPage({ params }) {
  const { slug } = params;
  const tour = await getTour(slug);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="w-full py-8 md:py-12 bg-white">
        <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 md:px-6 lg:px-8">
          <SectionHeading
            title={tour.title}
            align="center"
            size="md"
            underline
            underlineColor="bg-amber-500"
            underlineClassName="h-[3px] w-24 md:w-32 lg:w-40"
            className="mb-6 md:mb-10"
            description={tour.shortDescription}
          />
          <TourMeta
            durationDays={tour.durationDays}
            durationHours={tour.durationHours}
            inclusions={tour.inclusions}
            exclusions={tour.exclusions}
          />
          <div className="mt-8">
            <SectionHeading
              title="Itinerary"
              size="sm"
              align="left"
              underline
            />
            <TourItinerary itinerary={tour.itinerary} />
          </div>
          <div className="mt-8">
            <SectionHeading title="Harga" size="sm" align="left" underline />
            <TourPriceTable tiers={tour.priceTiers} />
          </div>
        </div>
      </section>
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 md:px-6 lg:px-8 pb-12">
        <WhatsAppCtaSection
          waUrlBase="https://wa.me/6287741861681"
          imageSrc="/imageforctasection.png"
          imageAlt={`Tour - ${tour.title}`}
        />
      </div>
    </div>
  );
}
