"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type MouseEvent, type TouchEvent } from "react";
import type { Product } from "@/types/product";
import { getProductGalleryImages } from "@/lib/products/helpers";

type ProductGalleryProps = {
  product: Product;
  activeImageUrl?: string;
  onImageChange?: (url: string) => void;
};

export function ProductGallery({
  product,
  activeImageUrl,
  onImageChange,
}: ProductGalleryProps) {
  const images = getProductGalleryImages(product);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const resolvedIndex = activeImageUrl
    ? Math.max(
        0,
        images.findIndex((image) => image.url === activeImageUrl),
      )
    : selectedIndex;

  const currentIndex = resolvedIndex >= 0 ? resolvedIndex : 0;
  const currentImage = images[currentIndex] ?? images[0];

  const goTo = useCallback(
    (index: number) => {
      const nextIndex = (index + images.length) % images.length;
      setSelectedIndex(nextIndex);
      onImageChange?.(images[nextIndex]?.url ?? "");
    },
    [images, onImageChange],
  );

  useEffect(() => {
    if (!activeImageUrl) {
      return;
    }

    const index = images.findIndex((image) => image.url === activeImageUrl);
    if (index >= 0) {
      setSelectedIndex(index);
    }
  }, [activeImageUrl, images]);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  const handleTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (touchStartX.current === null || images.length <= 1) {
      return;
    }

    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(delta) > 48) {
      goTo(currentIndex + (delta < 0 ? 1 : -1));
    }

    touchStartX.current = null;
  };

  if (!currentImage) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div
        className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-atres-border bg-atres-bg"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={currentImage.url}
          alt={currentImage.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-300 md:group-hover:scale-[1.35]"
          style={
            isHovering
              ? { transformOrigin: zoomOrigin.x + "% " + zoomOrigin.y + "%" }
              : undefined
          }
        />

        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white">
          {currentIndex + 1} / {images.length}
        </span>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Imagen anterior"
              onClick={() => goTo(currentIndex - 1)}
              className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 text-atres-text shadow-card transition hover:bg-white md:inline-flex"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Imagen siguiente"
              onClick={() => goTo(currentIndex + 1)}
              className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 text-atres-text shadow-card transition hover:bg-white md:inline-flex"
            >
              <ChevronRight size={20} />
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              aria-label={"Ver imagen " + (index + 1)}
              onClick={() => goTo(index)}
              className={
                "relative aspect-square overflow-hidden rounded-xl border bg-atres-bg transition duration-200 hover:scale-105 " +
                (index === currentIndex
                  ? "border-atres-primary ring-2 ring-atres-primary/20"
                  : "border-atres-border")
              }
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="72px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
