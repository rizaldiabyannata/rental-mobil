import CarCard from "./CarCard";
import SectionHeading from "@/components/SectionHeading";
import { prisma } from "@/lib/prisma";

async function getCars() {
  try {
    const cars = await prisma.car.findMany({
      where: { available: true },
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        slug: true,
        name: true,
        description: true,
        startingPrice: true,
        capacity: true,
        transmission: true,
        fuelType: true,
        specifications: true, // Untuk coverImage
        images: {
          select: {
            imageUrl: true,
            alt: true,
            order: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    // Strukturnya sedikit berbeda dari API, kita sesuaikan di sini
    return cars.map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      startingPrice: c.startingPrice,
      capacity: c.capacity,
      transmission: c.transmission,
      fuelType: c.fuelType,
      coverImage: c.specifications?.coverImage || null,
      gallery: c.images.map((img) => ({
        url: img.imageUrl,
        alt: img.alt,
        order: img.order,
      })),
    }));
  } catch (error) {
    console.error("Failed to fetch cars directly:", error);
    return []; // Return empty array on error
  }
}

const FleetSection = async () => {
  const carsData = await getCars();

  // Map API data ke format yang dibutuhkan CarCard
  const cars = carsData.map((car) => {
    // Ambil image: prioritas coverImage, fallback ke gallery order 0, fallback ke placeholder
    let image = "/InnovaReborn.png"; // default placeholder
    if (car.coverImage) {
      image = car.coverImage;
    } else if (Array.isArray(car.gallery) && car.gallery.length > 0) {
      const firstImage =
        car.gallery.find((img) => img.order === 0) || car.gallery[0];
      if (firstImage?.url) {
        const raw = firstImage.url;
        image = /^https?:\/\//i.test(raw)
          ? raw
          : raw.startsWith("/")
          ? raw
          : `/${raw}`;
      }
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
            title={"Armada Pilihan Kami"}
            align="center"
            size="md"
            underline
            underlineColor="bg-amber-500"
            underlineWidth="lg"
            underlineOffset="md"
            titleClassName="text-emerald-700"
            underlineClassName="h-[3px] w-24 md:w-32 lg:w-40"
            className="mb-6 md:mb-10"
            description={
              "Pilih mobil yang paling sesuai dengan kebutuhan perjalanan Anda."
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {cars.length > 0 ? (
            cars.map((car, index) => (
              <CarCard key={car.slug || index} car={car} />
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-600 py-8">
              Belum ada armada tersedia.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FleetSection;