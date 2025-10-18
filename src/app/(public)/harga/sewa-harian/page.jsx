import SewaHarianPage from "@/components/harga/SewaHarianClient";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Harga Sewa Mobil Harian di Lombok - Lepas Kunci & Dengan Sopir",
  description:
    "Daftar harga sewa mobil harian (12 jam atau 24 jam) di Lombok. Tersedia opsi lepas kunci atau dengan sopir. Armada lengkap, harga bersaing.",
};

async function getTariffData() {
  try {
    const items = await prisma.tariffItem.findMany({
      where: {
        OR: [
          {
            category: {
              name: { equals: "Sewa Per 12 Jam", mode: "insensitive" },
            },
          },
          {
            category: {
              name: { equals: "Tarif sewa per 12 jam", mode: "insensitive" },
            },
          },
        ],
      },
      include: {
        car: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { order: "asc" },
    });

    return items.map((item) => ({
      layanan: item.category?.name || "Sewa Per 12 Jam",
      paket: item.name,
      armada: item.car?.name || "Armada Pilihan",
      harga: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(item.price),
    }));
  } catch (error) {
    console.error("Failed to fetch tariff data directly:", error);
    return null;
  }
}

export default async function SewaHarianWrapper() {
  const data = await getTariffData();
  return <SewaHarianPage data={data || undefined} />;
}
