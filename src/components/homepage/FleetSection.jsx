import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const SeatIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    <path d="M20 18a8 8 0 0 0-8-8 8 8 0 0 0-8 8h16Z" />
  </svg>
);
const FuelIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" x2="15" y1="22" y2="22" />
    <line x1="4" x2="14" y1="9" y2="9" />
    <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
    <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 4" />
    <path d="M13 13H5" />
  </svg>
);
const CarIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9L1 16v1c0 .6.4 1 1 1h2" />
    <path d="M7 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    <path d="M17 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    <path d="M12 10V6.5" />
    <path d="m3 16-2 4" />
    <path d="M21 16 23 20" />
  </svg>
);

const cars = [
  {
    name: "Innova Reborn 2.4",
    description: "Unit Tahun 2025 sebanyak 8 Unit",
    image: "/armada.png",
    specs: [
      { icon: SeatIcon, label: "5 Seat" },
      { icon: FuelIcon, label: "Diesel" },
      { icon: CarIcon, label: "MPV" },
    ],
  },
  {
    name: "Toyota Hi-Ace",
    description: "sebanyak 2 unit",
    image: "/armada.png",
    specs: [
      { icon: SeatIcon, label: "5 Seat" },
      { icon: FuelIcon, label: "Diesel" },
      { icon: CarIcon, label: "MPV" },
    ],
  },
  // {
  //   name: "All of Request semua jenis mobil",
  //   description: "sesuai kebutuhan pelanggan",
  //   image: "/armada.png",
  //   specs: [
  //     { icon: SeatIcon, label: "-" },
  //     { icon: FuelIcon, label: "-" },
  //     { icon: CarIcon, label: "-" },
  //   ],
  // },
];

const FleetSection = () => {
  return (
    <section className="py-[15px] md:py-[25px]">
      <div className="container mx-auto px-4 lg:bg-gray-50 lg:rounded-[25px] lg:shadow-lg lg:my-12 lg:w-auto lg:h-auto lg:mx-auto lg:py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-sans text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-700">
            Armada Unggulan Kami
          </h2>
          <div className="w-[147px] md:w-[268px] h-[1px] bg-[#FF9700] mt-2 mx-auto" />
          <p className="text-gray-600 mt-6 text-base md:text-lg lg:text-xl">
            Pilihan armada terbaik kami untuk maksimal pengalaman anda
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {cars.map((car, index) => (
            <Card
              key={index}
              className="rounded-xl shadow-md w-full max-w-[315px] overflow-hidden flex flex-col lg:w-[calc(50%-16px)]"
            >
              <Image
                src={car.image}
                alt={car.name}
                width={315}
                height={210}
                className="w-full h-[210px] object-cover"
              />

              <CardContent className="p-4 flex-grow flex flex-col">
                <CardTitle className="font-geist text-base font-medium text-black">
                  {car.name}
                </CardTitle>
                <p className="font-geist text-xs font-normal text-gray-700 mb-4">
                  {car.description}
                </p>

                <div className="flex justify-around items-center w-full border-t border-b py-2 my-auto">
                  {car.specs.map((spec, specIndex) => (
                    <div key={specIndex} className="flex items-center gap-2">
                      <spec.icon className="size-5 text-gray-700" />
                      <span className="font-poppins text-[13px] font-normal text-black">
                        {spec.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <div className="p-4 pt-0 flex justify-end">
                <Link href="/detail-mobil">
                  <Button className="w-[152px] bg-emerald-600 hover:bg-emerald-700">
                    Sewa
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FleetSection;
