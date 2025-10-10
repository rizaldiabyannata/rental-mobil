import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const features = [
  {
    image: "/armada.png",
    title: "Kualitas Armada dan Pelayanan Profesional",
    description:
      "Armada Innova Reborn terawat dengan baik dan sopir kami berpengalaman serta ramah.",
  },
  {
    image: "/sopir.png",
    title: "Paket Harga Transparan dengan Nilai Tambah",
    description:
      "Harga termasuk sopir & bensin serta bonus pemandu wisata yang bisa menjadi fotografer.",
  },
  {
    image: "/pembayaran.png",
    title: "Kemudahan Proses dan Fokus pada Pelanggan",
    description:
      "Kami selalu memprioritaskan kemudahan dan kepuasan perjalanan Anda.",
  },
];

const WhyUsSection = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-12">
          <h2 className="font-sans text-4xl font-bold text-slate-900">
            Kenapa Harus <span className="text-emerald-700">Memilih Kami</span>
          </h2>
          <div className="w-[268px] h-[1px] bg-[#FF9700] mt-1" />
          <p className="text-gray-800 text-xl mt-6 max-w-3xl">
            Kami menawarkan lebih dari sekadar sewa mobil. Kami memberikan
            pengalaman perjalanan yang tak terlupakan.
          </p>
        </div>

        {/* Grid untuk Kartu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="overflow-hidden shadow-md hover:shadow-xl transition-shadow flex flex-col pb-4"
            >
              <Image
                src={feature.image}
                alt={feature.title}
                width={315}
                height={210}
                className="w-full h-[210px] object-cover rounded-t-xl"
              />
              <CardContent className="flex-grow flex flex-col">
                <CardTitle className="font-poppins text-lg font-semibold mb-2">
                  {feature.title}
                </CardTitle>
                <p className="text-sm text-gray-600 flex-grow">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
