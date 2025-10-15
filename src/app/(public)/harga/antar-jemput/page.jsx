import AntarJemputPage from "@/components/harga/AntarJemputClient";

async function fetchTariffData() {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || ""
      }/api/public/tariffs?serviceType=Tarif Antar Jemput Bandara`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const json = await res.json();

    // Transform API data to match frontend format
    const grouped = json?.data?.groupedByService || {};
    const antarJemputData = grouped["Tarif Antar Jemput Bandara"] || [];
    console.log("Fetched antar-jemput data:", antarJemputData);
    return antarJemputData.map((item) => ({
      layanan: item.category || "Antar Jemput Bandara",
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

export default async function AntarJemputWrapper() {
  const data = await fetchTariffData();
  return <AntarJemputPage data={data || undefined} />;
}
