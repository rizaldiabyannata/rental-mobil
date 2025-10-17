import SewaHarianPage from "@/components/harga/SewaHarianClient";

export const metadata = {
  title: "Harga Sewa Mobil Harian di Lombok - Lepas Kunci & Dengan Sopir",
  description:
    "Daftar harga sewa mobil harian (12 jam atau 24 jam) di Lombok. Tersedia opsi lepas kunci atau dengan sopir. Armada lengkap, harga bersaing.",
};

async function fetchTariffData() {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || ""
      }/api/public/tariffs?serviceType=Tarif sewa per 12 jam`
    );
    if (!res.ok) return null;
    const json = await res.json();

    // Transform API data to match frontend format
    const grouped = json?.data?.groupedByService || {};
    const sewaHarianData = grouped["Tarif sewa per 12 jam"] || [];
    console.log("Fetched sewa-harian data:", sewaHarianData);
    return sewaHarianData.map((item) => ({
      layanan: item.category || "Sewa Per 12 Jam",
      paket: item.packageType || item.name,
      armada: item.car?.name || "INNOVA REBORN",
      harga: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(item.price),
    }));
  } catch (e) {
    console.error("Failed to fetch tariff data:", e);
    return null;
  }
}

export default async function SewaHarianWrapper() {
  const data = await fetchTariffData();
  return <SewaHarianPage data={data || undefined} />;
}
