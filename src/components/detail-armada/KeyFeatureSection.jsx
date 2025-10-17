"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  ShieldCheck,
  Gauge,
  Snowflake,
  Package,
  Music2,
  Lock,
  Thermometer,
  Settings,
} from "lucide-react";
import SectionHeading from "../SectionHeading";
import { cn } from "@/lib/utils";

// Icon registry (keys in lowercase). Add aliases to improve matching.
const ICONS = {
  users: Users,
  user: Users,
  people: Users,

  shield: ShieldCheck,
  shieldcheck: ShieldCheck,

  gauge: Gauge,
  speedometer: Gauge,

  ac: Snowflake,
  snowflake: Snowflake,

  bagasi: Package,
  package: Package,

  hiburan: Music2,
  music: Music2,
  music2: Music2,

  lock: Lock,
  thermometer: Thermometer,
  settings: Settings,
  cog: Settings,
};

const FeatureCard = ({
  icon: Icon = Users,
  title,
  description,
  compactMd = false,
}) => (
  <Card className="bg-white border border-neutral-300 rounded-2xl shadow-md h-full">
    <CardContent
      className={cn(
        "p-6 lg:p-8 flex flex-col items-center text-center",
        compactMd ? "md:p-6" : "md:p-7"
      )}
    >
      <span className="inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full text-neutral-700">
        <Icon
          className={cn(
            "h-10 w-10",
            compactMd ? "md:h-11 md:w-11" : "md:h-12 md:w-12"
          )}
          strokeWidth={1.8}
        />
      </span>
      <h3 className="mt-4 text-lg md:text-xl font-semibold text-neutral-900">
        {title}
      </h3>
      {description ? (
        <p
          className={cn(
            "mt-2 text-sm leading-relaxed text-neutral-700",
            compactMd ? "md:text-sm" : "md:text-base"
          )}
        >
          {description}
        </p>
      ) : null}
    </CardContent>
  </Card>
);
const KeyFeatureSection = ({
  heading = "Fitur Unggulan",
  features = [
    {
      key: "kabin-luas",
      icon: "users",
      title: "Kabin Super Luas",
      description:
        "Kapasitas hingga 7 penumpang dengan ruang kaki yang lega. Perjalanan jauh tetap nyaman tanpa rasa sempit.",
    },
    {
      key: "ac-dingin",
      icon: "ac",
      title: "AC Dingin",
      description: "Suhu kabin sejuk dan stabil sepanjang perjalanan.",
    },
    {
      key: "keamanan",
      icon: "shield",
      title: "Keamanan Terjamin",
      description: "Fitur keselamatan lengkap untuk ketenangan Anda.",
    },
  ],
}) => {
  const featuresLen = Array.isArray(features) ? features.length : 0;
  return (
    <section className="w-full py-8 md:py-12">
      <div
        className={cn(
          "mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 md:px-6 lg:px-8",
          featuresLen === 3 && "md:max-w-4xl"
        )}
      >
        <div className="mb-6 md:mb-10 text-center">
          <SectionHeading
            title={heading}
            underline
            underlineColor={"bg-amber-500"}
            underlineClassName="h-[3px] w-24 md:w-32 lg:w-40"
            size="md"
            align="center"
            className="mb-6 md:mb-10 py-4"
          />
        </div>

        <div
          className={cn(
            featuresLen === 1
              ? "grid grid-cols-1 gap-4"
              : featuresLen === 2
              ? "grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2"
              : featuresLen === 3
              ? "grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3"
              : featuresLen % 2 === 0
              ? "grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2"
              : "grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2"
          )}
        >
          {features.map((feat, idx) => {
            const iconKey = (feat.icon || "").toString().trim().toLowerCase();
            const Icon = ICONS[iconKey] || Users;
            const key = feat.key || `${feat.title}-${idx}`;
            return (
              <FeatureCard
                key={key}
                icon={Icon}
                title={feat.title}
                description={feat.description}
                compactMd={featuresLen === 3}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatureSection;
