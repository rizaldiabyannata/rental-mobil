"use client";
import { usePriceFilter } from "@/hooks/usePriceFilter";
import FilterControls from "@/components/harga/FilterControls";
import PriceTable from "@/components/harga/PriceTable";

const dataTour = [
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
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Gili",
    armada: "INNOVA REBORN",
    harga: "Rp.650.000/Drop Rp.400.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram Sekotong",
    armada: "INNOVA REBORN",
    harga: "Rp.750.000/Drop Rp.550.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Tete Batu",
    armada: "INNOVA REBORN",
    harga: "Rp.800.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Benang Setukel",
    armada: "INNOVA REBORN",
    harga: "Rp.600.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Bandara",
    armada: "INNOVA REBORN",
    harga: "Rp.400.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Selong Beranak",
    armada: "INNOVA REBORN",
    harga: "Rp.700.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Senaru",
    armada: "INNOVA REBORN",
    harga: "Rp.850.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Senggigi",
    armada: "INNOVA REBORN",
    harga: "Rp.200.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Bangsal",
    armada: "INNOVA REBORN",
    harga: "Rp.400.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Pantai Pink",
    armada: "INNOVA REBORN",
    harga: "Rp.850.000",
  },

  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Sembalun",
    armada: "TOYOTA HIACE",
    harga: "Rp.1.200.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Kute",
    armada: "TOYOTA HIACE",
    harga: "Rp.1.000.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Gili",
    armada: "TOYOTA HIACE",
    harga: "Rp.900.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram Sekotong",
    armada: "TOYOTA HIACE",
    harga: "Rp.1.000.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Tete Batu",
    armada: "TOYOTA HIACE",
    harga: "Rp.900.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Benang Setukel",
    armada: "TOYOTA HIACE",
    harga: "Rp.900.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Bandara",
    armada: "TOYOTA HIACE",
    harga: "Rp.600.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Selong Beranak",
    armada: "TOYOTA HIACE",
    harga: "Rp.1000.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Senaru",
    armada: "TOYOTA HIACE",
    harga: "Rp.1.200.000",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Senggigi",
    armada: "TOYOTA HIACE",
    harga: "Rp.300.000 Drop",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Bangsal",
    armada: "TOYOTA HIACE",
    harga: "Rp.500.000 Drop",
  },
  {
    layanan: "Paket Tour Mataram,Lombok",
    paket: "Mataram-Pantai Pink",
    armada: "TOYOTA HIACE",
    harga: "Rp.1.000.000",
  },
];

const filterOptions = {
  armada: [...new Set(dataTour.map((item) => item.armada))],
  paket: [...new Set(dataTour.map((item) => item.paket))],
};

const PaketTourPage = () => {
  const { filters, filteredData, handleFilterChange } =
    usePriceFilter(dataTour);

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
          Daftar Harga Paket Tour
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Jelajahi Lombok dengan paket tour eksklusif kami.
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

export default PaketTourPage;
