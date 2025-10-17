"use client";
import { usePriceFilter } from "@/hooks/usePriceFilter";
import FilterControls from "@/components/harga/FilterControls";
import PriceTable from "@/components/harga/PriceTable";
import HeroSection from "@/components/homepage/HeroSection";

const defaultData = [
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Sembalun",
    armada: "INNOVA REBORN",
    harga: "Rp.850.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Kute",
    armada: "INNOVA REBORN",
    harga: "Rp.700.000/Drop Rp.500.000",
  },
  // ... rest of default data
];

const PaketTourPage = ({ data }) => {
  const dataTour = Array.isArray(data) && data.length > 0 ? data : defaultData;

  const filterOptions = {
    armada: [...new Set(dataTour.map((item) => item.armada))],
    paket: [...new Set(dataTour.map((item) => item.paket))],
  };

  const { filters, filteredData, handleFilterChange } =
    usePriceFilter(dataTour);

  const innovaFilteredData = filteredData.filter(
    (item) => item.armada === "INNOVA REBORN"
  );
  const hiaceFilteredData = filteredData.filter(
    (item) => item.armada === "TOYOTA HIACE"
  );

  return (
    <>
      <HeroSection imageOnRight={false} imageSrc="/Hero-3-1.png" />
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
    </>
  );
};

export default PaketTourPage;
