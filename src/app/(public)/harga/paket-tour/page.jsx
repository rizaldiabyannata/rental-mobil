import PaketTourPage from "@/components/harga/PaketTourClient";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Harga Paket Tour Lombok - Wisata Murah & Berkesan",
  description:
    "Temukan berbagai pilihan paket tour di Lombok dengan harga terbaik. Jelajahi destinasi wisata populer dengan nyaman bersama kami. Termasuk mobil dan sopir.",
};

async function getTariffData() {
  try {
    const items = await prisma.tariffItem.findMany({
      where: {
        category: { name: { contains: "paket tour", mode: "insensitive" } },
      },
      include: {
        car: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { order: "asc" },
    });

    return items.map((item) => ({
      layanan: item.category?.name || "Paket Tour",
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

export default async function PaketTourWrapper() {
  const data = await getTariffData();
  return <PaketTourPage data={data || undefined} />;
}
