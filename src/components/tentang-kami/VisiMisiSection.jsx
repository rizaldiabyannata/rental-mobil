"use client";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import {
  Car,
  Handshake,
  ShieldCheck,
  KeyRound,
  Globe2,
  Settings2,
} from "lucide-react";
import { useTranslations } from "next-intl";

const getMisiItems = (t) => [
  {
    title: t("missions.0.title"),
    description: t("missions.0.description"),
    Icon: Car,
  },
  {
    title: t("missions.1.title"),
    description: t("missions.1.description"),
    Icon: Settings2,
  },
  {
    title: t("missions.2.title"),
    description: t("missions.2.description"),
    Icon: ShieldCheck,
  },
  {
    title: t("missions.3.title"),
    description: t("missions.3.description"),
    Icon: Globe2,
  },
  {
    title: t("missions.4.title"),
    description: t("missions.4.description"),
    Icon: KeyRound,
  },
  {
    title: t("missions.5.title"),
    description: t("missions.5.description"),
    Icon: Handshake,
  },
];

const VisiMisiSection = () => {
  const t = useTranslations("aboutUs.visionMission");
  const misiItems = getMisiItems(t);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-32">
        <SectionHeading
          title={t.rich("title", {
            span: (chunks) => <span className="text-primary">{chunks}</span>,
          })}
          align="center"
          size="md"
          underline
          underlineColor="bg-amber-500"
          underlineWidth="lg"
          underlineOffset="md"
          underlineClassName="h-[3px] w-24 md:w-32 lg:w-40"
          className="mb-6 md:mb-10"
        />
        <div className="md:bg-[#EFF7FF] rounded-xl p-6 md:p-8 lg:p-10 mb-12">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="/target.svg"
              alt={t("visionTitle")}
              width={50}
              height={50}
            />
            <h2 className="font-sans text-[20px] md:text-2xl font-bold text-[#051C35]">
              {t("visionTitle")}
            </h2>
          </div>
          <p className="text-[#051C35] md:text-lg text-justify font-normal">
            {t("visionDescription")}
          </p>
        </div>

        {/* Misi */}
        <div className="md:bg-[#EFF7FF] rounded-xl p-6 md:p-8 lg:p-10">
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/target.svg"
              alt={t("missionTitle")}
              width={50}
              height={50}
              className="size-[32px] md:size-[50px]"
            />
            <h2 className="font-sans text-[20px] md:text-2xl font-bold text-[#051C35]">
              {t("missionTitle")}
            </h2>
          </div>

          {/* Kartu Misi */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {misiItems.map((item, index) => {
              const Icon = item.Icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-[10px] shadow-xl p-4 flex flex-col items-center text-center gap-4 md:p-6"
                >
                  <span className="inline-flex items-center justify-center rounded-full bg-[#EFF7FF] shadow-md p-3">
                    <Icon
                      className="h-8 w-8 text-primary"
                      aria-label={item.title}
                    />
                  </span>
                  <h3 className="font-sans font-semibold text-center mb-[8px] text-black text-sm md:text-[18px] lg:text-[20px]">
                    {item.title}
                  </h3>
                  <p className="text-[#051C35] text-[11px] md:text-[13px] lg:text-[14px]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisiMisiSection;
