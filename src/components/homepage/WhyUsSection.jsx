"use client";

import { Car, Medal, Wallet } from "lucide-react";
import SectionHeading from "../SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

const WhyUsSection = () => {
  const t = useTranslations("homepage.whyUs");

  const features = [
    {
      icon: Car,
      title: t("features.0.title"),
      description: t("features.0.description"),
    },
    {
      icon: Medal,
      title: t("features.1.title"),
      description: t("features.1.description"),
    },
    {
      icon: Wallet,
      title: t("features.2.title"),
      description: t("features.2.description"),
    },
  ];
  return (
    <section className="w-full py-16">
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 sm:px-6 md:px-6 lg:px-8">
        <div className="mb-12 text-center">
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
