import CarCard from "./CarCard";

const cars = [
  {
    name: "Innova Reborn",
    description: "Kenyamanan premium untuk keluarga dan bisnis.",
    image: "/car-1.jpg",
    price: "Rp 650.000",
    specs: [
      { icon: "Seat", label: "7 Seat" },
      { icon: "Fuel", label: "Diesel" },
      { icon: "Type", label: "MPV" },
    ],
  },
  {
    name: "Toyota Hi-Ace",
    description: "Solusi perjalanan untuk grup besar dengan nyaman.",
    image: "/car-2.jpg",
    price: "Rp 1.200.000",
    specs: [
      { icon: "Seat", label: "15 Seat" },
      { icon: "Fuel", label: "Diesel" },
      { icon: "Type", label: "Van" },
    ],
  },
  {
    name: "Toyota Avanza",
    description: "Pilihan ekonomis dan handal untuk perjalanan.",
    image: "/car-3.jpg",
    price: "Rp 500.000",
    specs: [
      { icon: "Seat", label: "7 Seat" },
      { icon: "Fuel", label: "Bensin" },
      { icon: "Type", label: "MPV" },
    ],
  },
];

const FleetSection = () => {
  return (
    <section id="armada" className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Armada Pilihan Kami
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Pilih mobil yang paling sesuai dengan kebutuhan perjalanan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((car, index) => (
            <CarCard key={index} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FleetSection;
