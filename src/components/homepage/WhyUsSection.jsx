import { Car, Medal, Wallet } from "lucide-react";

const features = [
  {
    icon: Car,
    title: "Armada Terawat & Berkualitas",
    description:
      "Semua mobil kami dalam kondisi prima dan terawat secara rutin untuk menjamin keamanan dan kenyamanan Anda.",
  },
  {
    icon: Medal,
    title: "Supir Profesional & Berpengalaman",
    description:
      "Supir kami tidak hanya ahli mengemudi, tetapi juga ramah dan siap menjadi pemandu wisata Anda.",
  },
  {
    icon: Wallet,
    title: "Harga Terbaik & Transparan",
    description:
      "Kami menawarkan harga sewa yang kompetitif tanpa biaya tersembunyi, memberikan nilai terbaik untuk Anda.",
  },
];

const WhyUsSection = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Kenapa Memilih Reborn Lombok Trans?
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Kami berkomitmen memberikan lebih dari sekadar sewa mobil.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-4 text-center"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Icon className="size-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-base text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
