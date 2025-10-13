"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const CarDetailCarousel = ({ images = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample images if none provided
  const sampleImages = [
    {
      id: 1,
      src: "/placeholder-car-1.jpg",
      alt: "Toyota Kijang Innova Reborn - View 1",
    },
    {
      id: 2,
      src: "/placeholder-car-2.jpg",
      alt: "Toyota Kijang Innova Reborn - View 2",
    },
    {
      id: 3,
      src: "/placeholder-car-3.jpg",
      alt: "Toyota Kijang Innova Reborn - View 3",
    },
  ];

  const carImages = images.length > 0 ? images : sampleImages;
  const [emblaApi, setEmblaApi] = useState(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <div className="w-full px-2.5 py-6">
      <div className="relative w-full">
        <Carousel
          setApi={setEmblaApi}
          className="w-full h-[250px] md:h-[320px] lg:h-[420px]"
        >
          <CarouselContent>
            {carImages.map((image, index) => (
              <CarouselItem key={image.id || index}>
                <div className="h-[250px] md:h-[320px] lg:h-[420px]">
                  <Card className="h-full border-neutral-200 rounded-[10px]">
                    <CardContent className="flex items-center justify-center h-full p-4 bg-white">
                      {/* Placeholder for now - will show slide number */}
                      <span className="text-[30px] font-semibold text-neutral-950 leading-none tracking-[-0.3px]">
                        {index + 1}
                      </span>
                      {/* TODO: Replace with actual image when images are provided */}
                      {/* <img 
                        src={image.src} 
                        alt={image.alt}
                        className="w-full h-full object-cover rounded-lg"
                      /> */}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-3 md:left-4 bg-white/10 border-neutral-200 h-9 w-9 md:h-10 md:w-10 rounded-lg backdrop-blur-sm text-neutral-800 hover:text-neutral-800 dark:text-neutral-200 dark:hover:text-neutral-200 hover:bg-white/10" />
          <CarouselNext className="right-3 md:right-4 bg-white/10 border-neutral-200 h-9 w-9 md:h-10 md:w-10 rounded-lg backdrop-blur-sm text-neutral-800 hover:text-neutral-800 dark:text-neutral-200 dark:hover:text-neutral-200 hover:bg-white/10" />
        </Carousel>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-3 md:gap-3.5 pt-4 pb-4">
          {carImages.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-md border border-[#333333] transition-colors ${
                index === currentSlide ? "bg-[#333333]" : "bg-[#aaaaaa]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarDetailCarousel;
