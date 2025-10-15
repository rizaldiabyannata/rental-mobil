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
    <section className="bg-white py-[25px] md:py-[50px]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-sans text-[24px] md:text-3xl lg:text-4xl font-bold text-emerald-700">
            Jenis Layanan Kami
          </h2>
          <div className="w-[147px] md:w-[268px] h-[1px] bg-[#FF9700] mt-2 mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="rounded-lg border border-gray-200 bg-white shadow-md p-4 md:p-6 flex flex-col items-start gap-2"
            >
              <CardTitle className="font-geist text-sm md:text-[16px] lg:text-xl font-semibold text-gray-900 leading-tight">
                {service.title}
              </CardTitle>
              <p className="font-geist text-[10px] md:text-[12px] lg:text-sm font-normal text-gray-500 leading-normal">
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
