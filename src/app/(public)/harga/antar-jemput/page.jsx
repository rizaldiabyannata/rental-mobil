import AntarJemputPage from "@/components/harga/AntarJemputClient";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Harga Antar Jemput Bandara Lombok - Tarif Murah & Terjangkau",
  description:
    "Lihat daftar harga layanan antar jemput dari dan ke Bandara Internasional Lombok. Tarif flat, transparan, dan kompetitif untuk berbagai jenis armada.",
};

async function getTariffData() {
  try {
    const items = await prisma.tariffItem.findMany({
      where: {
        category: { name: { contains: "antar jemput", mode: "insensitive" } },
      },
      include: {
        car: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { order: "asc" },
    });

    return items.map((item) => ({
      layanan: item.category?.name || "Antar Jemput Bandara",
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

export default async function AntarJemputWrapper() {
  const data = await getTariffData();
  return <AntarJemputPage data={data || undefined} />;
}
