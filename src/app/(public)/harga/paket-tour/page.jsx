import PaketTourPage from "@/components/harga/PaketTourClient";

async function fetchTariffData() {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || ""
      }/api/public/tariffs?serviceType=Paket Tour Mataram, Lombok`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const json = await res.json();

    // Transform API data to match frontend format
    const grouped = json?.data?.groupedByService || {};
    const paketTourData = grouped["Paket Tour Mataram, Lombok"] || [];

    return paketTourData.map((item) => ({
      layanan: item.category || "Paket Tour Mataram, Lombok",
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

export default async function PaketTourWrapper() {
  const data = await fetchTariffData();
  return <PaketTourPage data={data || undefined} />;
}
