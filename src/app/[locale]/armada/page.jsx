import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import PageHero from "@/components/shared/PageHero";
import FleetSection from "@/components/homepage/FleetSection";

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: "armada.meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

async function getCars() {
  try {
    const cars = await prisma.car.findMany({
      where: { available: true },
      orderBy: { createdAt: "desc" },
      select: {
        slug: true,
        name: true,
        description: true,
        startingPrice: true,
        capacity: true,
        transmission: true,
        fuelType: true,
        specifications: true,
        images: {
          select: { imageUrl: true, alt: true, order: true },
          orderBy: { order: "asc" },
        },
      },
    });
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
    console.error("Failed to fetch all cars:", error);
    return [];
  }
}

export default async function ArmadaPage({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: "armada.hero" });
  const carsData = await getCars();

  return (
    <>
      <PageHero
        title={t("title")}
        subtitle={t("subtitle")}
        imageSrc="/Hero-1.png"
      />
      <FleetSection carsData={carsData} />
    </>
  );
}
