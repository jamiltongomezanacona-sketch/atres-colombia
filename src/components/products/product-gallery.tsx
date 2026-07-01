"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ name, images }: { name: string; images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-atres-border bg-atres-panel">
        <Image
          src={selectedImage}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 46vw"
          className="object-cover"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {images.map((image) => (
          <button
            key={image}
            aria-label={"Ver imagen de " + name}
            onClick={() => setSelectedImage(image)}
            className={
              "relative aspect-square overflow-hidden rounded-md border bg-white/5 " +
              (image === selectedImage ? "border-atres-green" : "border-atres-border")
            }
          >
            <Image src={image} alt={name} fill sizes="120px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
