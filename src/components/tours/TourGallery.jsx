"use client";

import Image from "next/image";
import { useState } from "react";

export default function TourGallery({
  images = [],
  alt = "Tour Gallery Image",
}) {
  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">No Image Available</span>
      </div>
    );
  }

  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="grid gap-4">
      <div className="aspect-video relative overflow-hidden rounded-lg">
        <Image
          src={mainImage}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 75vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setMainImage(image)}
              className={`aspect-square relative overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                mainImage === image ? "ring-2 ring-primary" : ""
              }`}
            >
              <Image
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
