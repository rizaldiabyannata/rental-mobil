"use client";

import React from "react";
import CarDetailCarousel from "./CarDetailCarousel";

const CarDetailInfo = ({
  car = {
    name: "Toyota Kijang Innova Reborn",
    description:
      "Pilihan sempurna untuk kenyamanan perjalanan keluarga dan bisnis Anda.",
    price: "650.000",
    priceUnit: "/ 12 Jam (Termasuk Driver)",
    longDescription:
      "Nikmati pengalaman berkendara yang premium dengan Toyota Innova Reborn. Dikenal dengan ketangguhan, ruang kabin yang sangat lega, dan suspensi yang nyaman, mobil ini adalah partner terbaik untuk menjelajahi keindahan Lombok, mulai dari pantai Senggigi hingga perbukitan Mandalika.",
    images: [],
  },
}) => {
  const handleContactClick = () => {
    const message = encodeURIComponent(
      "Halo, saya tertarik dengan layanan Anda"
    );
    window.open(`https://wa.me/6285353818685?text=${message}`, "_blank");
  };

  return (
    <div className="w-full">
      {/* Carousel Section - visible on mobile; on md+ will be placed by wrapper section */}
      <div className="md:hidden">
        <CarDetailCarousel images={car.images} />
      </div>

      {/* Car Information Section */}
      <div className="flex flex-col gap-1 w-full px-2.5 md:px-0">
        {/* Car Title */}
        <div className="w-full">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-700 leading-[56.32px] md:leading-[1.2] font-sans">
            {car.name}
          </h1>
        </div>

        {/* Car Description */}
        <div className="pb-4 w-full">
          <p className="text-sm md:text-base font-normal text-[#051c35] leading-6 md:leading-7 tracking-[0.07px] font-sans">
            {car.description}
          </p>
        </div>

        {/* Separator */}
        <div className="flex items-center justify-center">
          <div className="h-px w-full bg-[#aaaaaa] transform scale-y-[-1]" />
        </div>

        {/* Price Section */}
        <div className="pt-4 pb-1 w-full">
          <div className="w-full mb-[-1px]">
            <p className="text-2xl md:text-3xl font-bold text-black leading-[51.2px] md:leading-[1.2] font-sans">
              Mulai Rp {car.price}
            </p>
          </div>
          <div className="w-full mb-[-1px]">
            <p className="text-[13.7px] md:text-sm font-normal text-[#777777] leading-[23px] md:leading-6 max-h-[23.04px] md:max-h-none overflow-hidden overflow-ellipsis font-sans">
              {car.priceUnit}
            </p>
          </div>
        </div>

        {/* Long Description */}
        <div className="pt-4 pb-6 w-full">
          <p className="text-xs md:text-sm font-normal text-black leading-normal tracking-[0.18px] font-sans">
            {car.longDescription}
          </p>
        </div>

        {/* Contact Button */}
        <div className="flex items-start justify-center md:justify-start gap-[103px] w-full">
          <button
            onClick={handleContactClick}
            className="bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200 flex gap-2.5 items-center justify-center overflow-hidden px-[18px] py-2.5 rounded-xl shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] cursor-pointer"
          >
            <span className="text-xs md:text-sm font-semibold leading-normal text-center text-white tracking-[0.5px] font-sans">
              Hubungi Kami
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarDetailInfo;
