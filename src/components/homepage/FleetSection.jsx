import CarCard from "./CarCard";
import SectionHeading from "@/components/SectionHeading";

const cars = [
  {
    name: "Innova Reborn",
    description: "Kenyamanan premium untuk keluarga dan bisnis.",
    image: "/InnovaReborn.png",
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
    image: "/hiace-1.png",
    price: "Rp 1.200.000",
    specs: [
      { icon: "Seat", label: "15 Seat" },
      { icon: "Fuel", label: "Diesel" },
      { icon: "Type", label: "Van" },
    ],
  },
];

const FleetSection = () => {
  return (
    <section id="armada" className="w-full md:pt-10 py-16">
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 sm:px-6 md:px-6 lg:px-8">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <SectionHeading
            title={"Armada Pilihan Kami"}
            align="center"
            size="md"
            underline
            underlineColor="bg-amber-500"
            underlineWidth="lg"
            underlineOffset="md"
            titleClassName="text-emerald-700"
            underlineClassName="h-[3px] w-24 md:w-32 lg:w-40"
            className="mb-6 md:mb-10"
            description={
              "Pilih mobil yang paling sesuai dengan kebutuhan perjalanan Anda."
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {cars.map((car, index) => (
            <CarCard key={index} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FleetSection;
