"use client";

import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { useState } from "react";

export function ProductGallery({ name, images }: { name: string; images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="space-y-4">
      <div
        className={
          "relative aspect-[3/4] overflow-hidden rounded-2xl border border-atres-border bg-atres-bg " +
          (zoomed ? "cursor-zoom-out" : "cursor-zoom-in")
        }
        onClick={() => setZoomed((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setZoomed((current) => !current);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={zoomed ? "Reducir imagen" : "Ampliar imagen"}
      >
        <Image
          src={selectedImage}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className={
            "object-cover transition duration-300 " +
            (zoomed ? "scale-150" : "scale-100 hover:scale-105")
          }
        />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-atres-text shadow-card">
          <ZoomIn size={14} />
          {zoomed ? "Clic para reducir" : "Clic para zoom"}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {images.map((image) => (
          <button
            key={image}
            type="button"
            aria-label={"Ver imagen de " + name}
            onClick={() => {
              setSelectedImage(image);
              setZoomed(false);
            }}
            className={
              "relative aspect-square cursor-pointer overflow-hidden rounded-xl border bg-atres-bg transition duration-200 hover:scale-105 " +
              (image === selectedImage
                ? "border-atres-primary ring-2 ring-atres-primary/20"
                : "border-atres-border")
            }
          >
            <Image src={image} alt={name} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
