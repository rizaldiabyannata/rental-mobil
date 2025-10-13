"use client";
import { usePriceFilter } from "@/hooks/usePriceFilter";
import FilterControls from "@/components/harga/FilterControls";
import PriceTable from "@/components/harga/PriceTable";

const dataTour = [
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
  armada: [...new Set(dataTour.map((item) => item.armada))],
  paket: [...new Set(dataTour.map((item) => item.paket))],
};

const AntarJemputPage = () => {
  const { filters, filteredData, handleFilterChange } =
    usePriceFilter(dataTour);

  const innovaFilteredData = filteredData.filter(
    (item) => item.armada === "INNOVA REBORN"
  );
  const hiaceFilteredData = filteredData.filter(
    (item) => item.armada === "TOYOTA HIACE"
  );

  return (
    <main className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-12 text-emerald-700">
        Daftar Harga Paket Tour
        <div className="w-[147px] md:w-[268px] h-[1px] bg-[#FF9700] mt-2 mx-auto" />
      </h1>

      <FilterControls
        filters={filters}
        onFilterChange={handleFilterChange}
        options={filterOptions}
      />
      {innovaFilteredData.length > 0 && (
        <PriceTable title="Armada: Innova Reborn" data={innovaFilteredData} />
      )}

      {hiaceFilteredData.length > 0 && (
        <PriceTable title="Armada: Toyota Hiace" data={hiaceFilteredData} />
      )}

      {filteredData.length === 0 && (
        <p className="text-center text-gray-500">
          Tidak ada hasil yang cocok dengan filter Anda.
        </p>
      )}
    </main>
  );
};

export default AntarJemputPage;
