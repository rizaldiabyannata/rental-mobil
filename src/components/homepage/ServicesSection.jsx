import { Card, CardTitle } from "@/components/ui/card";
import SectionHeading from "@/components/SectionHeading";

const services = [
  {
    title: "Rental Mobil All-in-one",
    description: "Sewa mobil dengan supir profesional dan BBM.",
  },
  {
    title: "Tour Keliling Lombok",
    description: "Jelajahi berbagai destinasi wisata di Lombok.",
  },
  {
    title: "City Tour Mataram",
    description: "Pengalaman menyenangkan berkeliling ibu kota.",
  },
  {
    title: "Antar Jemput",
    description: "Layanan penjemputan dan pengantaran praktis.",
  },
  {
    title: "Sewa Fleksibel",
    description: "Tentukan sendiri durasi sewa sesuai kebutuhan.",
  },
  {
    title: "Field Trip & Building",
    description: "Akomodasi transportasi kegiatan rombongan.",
  },
];

const ServicesSection = () => {
  return (
    <section className="w-full md:pt-10 py-16">
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 sm:px-6 md:px-6 lg:px-8">
        <SectionHeading
          title={"Jenis Layanan Kami"}
          align="center"
          size="md"
          underline
          underlineColor="bg-amber-500"
          underlineWidth="lg"
          underlineOffset="md"
          titleClassName="text-primary"
          underlineClassName="h-[3px] w-24 md:w-32 lg:w-40"
          className="mb-6 md:mb-10"
          description={
            "Kami menawarkan berbagai layanan untuk memenuhi setiap kebutuhan perjalanan Anda."
          }
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card
              key={index}
              className="flex flex-col gap-2 rounded-lg p-6 shadow-sm"
            >
              <CardTitle className="font-sans text-lg font-semibold text-gray-900">
                {service.title}
              </CardTitle>
              <p className="font-sans text-sm text-gray-600">
                {service.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
