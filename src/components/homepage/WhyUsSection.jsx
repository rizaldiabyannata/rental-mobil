import { Car, Medal, Wallet } from "lucide-react";
import SectionHeading from "../SectionHeading";
import { Card, CardContent } from "@/components/ui/card";

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
    <section className="w-full py-16">
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 sm:px-6 md:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <SectionHeading
            title={"Kenapa Memilih Reborn Lombok Trans?"}
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
              "Kami berkomitmen memberikan lebih dari sekadar sewa mobil."
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-full bg-[#EFF7FF] text-primary">
                    <Icon className="size-8" />
                  </div>
                  <h3 className="text-xl md:text-lg lg:text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-base md:text-sm lg:text-base text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
