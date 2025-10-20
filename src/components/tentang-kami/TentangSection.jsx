"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const FeatureBlock = ({ imageSrc, title, description, imageLeft = false }) => {
  const imageOrder = imageLeft ? "md:order-first" : "md:order-last";
  const textAlign = imageLeft ? "md:text-left" : "md:text-left"; // Keep text-left on desktop

  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 py-8">
      <div className={`relative aspect-video w-full ${imageOrder}`}>
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="rounded-lg object-cover shadow-lg"
        />
      </div>
      <div className={`text-center ${textAlign}`}>
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {title}
        </h3>
        <p className="mt-4 text-lg text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const TentangSection = () => {
  const t = useTranslations("aboutUs.aboutSection");

  return (
    <section className={cn("w-full py-8 md:py-12")}>
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 md:px-6 lg:px-8">
        <FeatureBlock
          imageSrc="/Hiace-1.png"
          title={t("title")}
          description={t("description")}
          imageLeft={true}
        />
        <FeatureBlock
          imageSrc="/InnovaReborn-2.png"
          title={t("armadaTitle")}
          description={t("armadaDescription")}
          imageLeft={false}
        />
      </div>
    </section>
  );
};
export default TentangSection;
