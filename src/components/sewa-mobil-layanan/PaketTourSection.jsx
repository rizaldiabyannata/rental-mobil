"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Link } from "@/navigation"; // Correct import
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import { useTranslations } from "next-intl";

const PaketTourSection = () => {
  const t = useTranslations("homepage.paketTour");

  const tourPackages = [
    {
      title: t("packages.0.title"),
      description: t("packages.0.description"),
      image: "/sewa.png",
      href: "/harga/sewa-harian",
      imagePosition: "object-top",
    },
    {
      title: t("packages.1.title"),
      description: t("packages.1.description"),
      image: "/antar-jemput.png",
      href: "/harga/antar-jemput",
      imagePosition: "object-bottom",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("title")}
          align="center"
          size="md"
          underline
          underlineColor="bg-amber-500"
          underlineWidth="lg"
          underlineOffset="md"
          titleClassName="text-primary"
          underlineClassName="h-[3-px] w-24 md:w-32 lg:w-40"
          className="mb-6 md:mb-10"
          description={t("description")}
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {tourPackages.map((pkg, index) => (
            <Card
              key={index}
              className="flex flex-col overflow-hidden rounded-lg shadow-lg pt-0"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className={`object-cover ${pkg.imagePosition} `}
                />
              </div>
              <CardContent className="flex flex-1 flex-col p-6">
                <CardTitle className="text-xl font-bold text-gray-900">
                  {pkg.title}
                </CardTitle>
                <p className="mt-2 flex-1 text-base text-gray-600">
                  {pkg.description}
                </p>
                <div className="mt-4">
                  <Link href={pkg.href}>
                    <Button variant="link" className="p-0 text-base">
                      {t("learnMore")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default PaketTourSection;
