import { prisma } from "@/lib/prisma";

// Avoid build-time failures when DB is not yet migrated
export const dynamic = "force-dynamic";

const siteUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.rentalmobil.com";

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
    "/armada", // Halaman daftar armada
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: route === "/" ? 1.0 : 0.8,
  }));

  // Halaman dinamis untuk setiap mobil (safe fallback if DB not ready)
  let carRoutes = [];
  try {
    const cars = await prisma.car.findMany({
      where: { available: true },
      select: { slug: true, updatedAt: true },
    });
    carRoutes = cars.map((car) => ({
      url: `${siteUrl}/armada/${car.slug}`,
      lastModified: car.updatedAt.toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      "sitemap: DB not ready, returning static routes only",
      err?.message || err
    );
  }

  return [...staticRoutes, ...carRoutes];
}
