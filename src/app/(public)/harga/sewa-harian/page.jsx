"use client";
import { usePriceFilter } from "@/hooks/usePriceFilter";
import FilterControls from "@/components/harga/FilterControls";
import PriceTable from "@/components/harga/PriceTable";

const dataTour = [
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
  armada: [...new Set(dataTour.map((item) => item.armada))],
  paket: [...new Set(dataTour.map((item) => item.paket))],
};

const SewaHarianPage = () => {
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

export default SewaHarianPage;
