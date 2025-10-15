
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Users, Fuel, Car } from "lucide-react";

const iconMap = {
  Seat: Users,
  Fuel: Fuel,
  Type: Car,
};

const CarCard = ({ car }) => {
  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl shadow-lg transition-transform hover:scale-105">
      <div className="relative h-56 w-full">
        <Image
          src={car.image}
          alt={car.name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="flex flex-1 flex-col p-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{car.name}</h3>
          <p className="mt-1 text-sm text-gray-600">{car.description}</p>
          <div className="my-4 flex items-center gap-4 text-sm text-gray-700">
            {car.specs.map((spec, index) => {
              const Icon = iconMap[spec.icon];
              return (
                <div key={index} className="flex items-center gap-2">
                  {Icon && <Icon className="size-4" />}
                  <span>{spec.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-auto">
          <p className="text-xl font-bold text-gray-900">
            {car.price}{" "}
            <span className="text-sm font-normal text-gray-600">/hari</span>
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link href={`/detail-armada?name=${car.name}`}>
              <Button className="w-full">Booking</Button>
            </Link>
            <Link href={`/detail-armada?name=${car.name}`}>
              <Button variant="outline" className="w-full">
                Detail
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;
