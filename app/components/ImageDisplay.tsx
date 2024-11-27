"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageDisplayProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageDisplay({ src, alt, className = '' }: ImageDisplayProps) {
  const [aspectRatio, setAspectRatio] = useState<'portrait' | 'landscape'>('landscape');

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    
    img.onload = () => {
      setAspectRatio(img.height > img.width ? 'portrait' : 'landscape');
    };
  }, [src]);

  return (
    <div className={`relative w-full ${
      aspectRatio === 'portrait' ? 'h-[500px]' : 'aspect-square'
    } ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-contain bg-navy-900/50 rounded-lg ${
          aspectRatio === 'portrait' ? 'object-contain' : 'object-cover'
        }`}
      />
    </div>
  );
} 