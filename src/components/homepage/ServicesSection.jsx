import { Card, CardTitle } from "@/components/ui/card";

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
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Jenis Layanan Kami
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Kami menawarkan berbagai layanan untuk memenuhi setiap kebutuhan
            perjalanan Anda.
          </p>
        </div>

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
