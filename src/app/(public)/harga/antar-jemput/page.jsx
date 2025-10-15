"use client";
import { usePriceFilter } from "@/hooks/usePriceFilter";
import FilterControls from "@/components/harga/FilterControls";
import PriceTable from "@/components/harga/PriceTable";

const dataAntarJemput = [
  {
    layanan: "Tarif Antar Jemput Bandara",
    paket: "Mataram",
    armada: "INNOVA REBORN",
    harga: "Rp.450.000",
  },
  {
    layanan: "Tarif Antar Jemput Bandara",
    paket: "Senggigi",
    armada: "INNOVA REBORN",
    harga: "Rp.550.000",
  },
  {
    layanan: "Tarif Antar Jemput Bandara",
    paket: "Bangsal",
    armada: "INNOVA REBORN",
    harga: "Rp.750.000",
  },
  {
    layanan: "Tarif Antar Jemput Bandara",
    paket: "Kute",
    armada: "INNOVA REBORN",
    harga: "Rp.500.000",
  },
];

const filterOptions = {
  armada: [...new Set(dataAntarJemput.map((item) => item.armada))],
  paket: [...new Set(dataAntarJemput.map((item) => item.paket))],
};

const AntarJemputPage = () => {
  const { filters, filteredData, handleFilterChange } =
    usePriceFilter(dataAntarJemput);

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
          Daftar Harga Antar Jemput
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Layanan antar jemput dari dan ke bandara dengan harga terbaik.
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

export default AntarJemputPage;
