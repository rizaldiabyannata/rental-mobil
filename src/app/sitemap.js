import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.rentalmobil.com";

export default async function sitemap() {
  // Halaman statis
  const staticRoutes = [
    "/",
    "/tentang-kami",
    "/harga/antar-jemput",
    "/harga/paket-tour",
    "/harga/sewa-harian",
    "/syarat-ketentuan",
    "/sewa-mobil-layanan",
    "/armada" // Halaman daftar armada
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: route === "/" ? 1.0 : 0.8,
  }));

  // Halaman dinamis untuk setiap mobil
  const cars = await prisma.car.findMany({
    where: { available: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const carRoutes = cars.map((car) => ({
    url: `${siteUrl}/armada/${car.slug}`,
    lastModified: car.updatedAt.toISOString(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...carRoutes];
}
