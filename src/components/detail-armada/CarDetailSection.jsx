"use client";

import React from "react";
import CarDetailCarousel from "./CarDetailCarousel";
import CarDetailInfo from "./CarDetailInfo";

// Layout wrapper: mobile stacks, md+ uses two-column layout per Figma desktop
const CarDetailSection = ({ car }) => {
  return (
    <section className="w-full md:pt-10">
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-0 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 lg:gap-10">
          {/* Left: Carousel visible on md+; hidden on mobile since CarDetailInfo renders its own mobile carousel */}
          <div className="hidden md:block">
            <CarDetailCarousel images={car?.images || []} />
          </div>

          {/* Right: Info */}
          <div className="md:self-center">
            <CarDetailInfo car={car} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarDetailSection;
