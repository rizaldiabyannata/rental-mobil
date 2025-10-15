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

import PageHero from "@/components/shared/PageHero";

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
    <>
      <PageHero
        title="Harga Antar Jemput"
        breadcrumbs={[
          { label: "Harga", href: "/harga/sewa-harian" },
          { label: "Antar Jemput" },
        ]}
      />
      <main className="container mx-auto px-4 py-12 md:py-16">
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
