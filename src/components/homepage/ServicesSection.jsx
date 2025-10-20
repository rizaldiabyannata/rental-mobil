"use client";

import { Card, CardTitle } from "@/components/ui/card";
import SectionHeading from "@/components/SectionHeading";
import { useTranslations } from "next-intl";

const ServicesSection = () => {
  const t = useTranslations("homepage.services");

  const services = [
    {
      title: t("items.0.title"),
      description: t("items.0.description"),
    },
    {
      title: t("items.1.title"),
      description: t("items.1.description"),
    },
    {
      title: t("items.2.title"),
      description: t("items.2.description"),
    },
    {
      title: t("items.3.title"),
      description: t("items.3.description"),
    },
    {
      title: t("items.4.title"),
      description: t("items.4.description"),
    },
    {
      title: t("items.5.title"),
      description: t("items.5.description"),
    },
  ];
  return (
    <section className="w-full md:pt-10 py-16">
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 sm:px-6 md:px-6 lg:px-8">
        <SectionHeading
          title={t("title")}
          align="center"
          size="md"
          underline
          underlineColor="bg-amber-500"
          underlineWidth="lg"
          underlineOffset="md"
          titleClassName="text-primary"
          underlineClassName="h-[3px] w-24 md:w-32 lg:w-40"
          className="mb-6 md:mb-10"
          description={t("description")}
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
