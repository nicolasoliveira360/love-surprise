"use client";

import { type FC, useState, useEffect } from 'react';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ImageSlideshowProps {
  images: Array<string | StaticImageData>;
  autoPlay?: boolean;
  interval?: number;
}

const ImageSlideshow: FC<ImageSlideshowProps> = ({ 
  images, 
  autoPlay = false, 
  interval = 7000
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (autoPlay && images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev: number) => (prev + 1) % images.length);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [autoPlay, images.length, interval]);

  const next = () => {
    setCurrentIndex((prev: number) => (prev + 1) % images.length);
  };

  const prev = () => {
    setCurrentIndex((prev: number) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (!images.length) return null;

  return (
    <div className="relative w-full h-full bg-navy-900">
      <div className="w-full h-full relative">
        <Image
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          fill
          className="object-contain"
          priority
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10"
          >
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10"
          >
            <ChevronRightIcon className="w-6 h-6 text-white" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_: unknown, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-pink-500 scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSlideshow; 