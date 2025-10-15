"use client";
import { usePriceFilter } from "@/hooks/usePriceFilter";
import FilterControls from "@/components/harga/FilterControls";
import PriceTable from "@/components/harga/PriceTable";

const dataSewaHarian = [
  {
    layanan: "Tarif Sewa per 12 jam",
    paket: "Dengan Driver",
    armada: "INNOVA REBORN",
    harga: "Rp.650.000",
  },
  {
    layanan: "Tarif Sewa per 12 jam",
    paket: "Dengan Driver + BBM (Normal)",
    armada: "INNOVA REBORN",
    harga: "Rp.800.000",
  },
  {
    layanan: "Tarif Sewa per 12 jam",
    paket: "Dengan Driver + BBM (Highseason)",
    armada: "INNOVA REBORN",
    harga: "Rp.1.200.000",
  },
  {
    layanan: "Tarif Sewa per 12 jam",
    paket: "Overtime per Jam",
    armada: "INNOVA REBORN",
    harga: "Rp.60.000",
  },
  {
    layanan: "Tarif Sewa per 12 jam",
    paket: "Penambahan biaya di Luar Rute (Mataram, Sengigi, Kute)",
    armada: "INNOVA REBORN",
    harga: "Rp.125.000",
  },
];

const filterOptions = {
  armada: [...new Set(dataSewaHarian.map((item) => item.armada))],
  paket: [...new Set(dataSewaHarian.map((item) => item.paket))],
};

const SewaHarianPage = () => {
  const { filters, filteredData, handleFilterChange } =
    usePriceFilter(dataSewaHarian);

  const innovaFilteredData = filteredData.filter(
    (item) => item.armada === "INNOVA REBORN"
  );
  const hiaceFilteredData = filteredData.filter(
    (item) => item.armada === "TOYOTA HIACE"
  );

  return (
    <main className="container mx-auto px-4 py-12 md:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Daftar Harga Sewa Harian
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Temukan tarif terbaik untuk kebutuhan sewa harian Anda.
        </p>
      </div>

      <div className="space-y-8">
        <FilterControls
          filters={filters}
          onFilterChange={handleFilterChange}
          options={filterOptions}
        />

        <div className="space-y-12">
          {innovaFilteredData.length > 0 && (
            <PriceTable
              title="Armada: Innova Reborn"
              data={innovaFilteredData}
            />
          )}

          {hiaceFilteredData.length > 0 && (
            <PriceTable
              title="Armada: Toyota Hiace"
              data={hiaceFilteredData}
            />
          )}

          {filteredData.length === 0 && (
            <p className="text-center text-gray-500">
              Tidak ada hasil yang cocok dengan filter Anda.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default SewaHarianPage;
