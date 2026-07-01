"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { HeroSlide } from "@/data/hero-slides";

type HeroSliderProps = {
  slides: HeroSlide[];
};

const primaryBtnClass =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-atres-gold bg-atres-gold px-5 text-sm font-semibold text-white transition duration-200 hover:scale-[1.02] hover:brightness-110";

const secondaryBtnClass =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/80 bg-transparent px-5 text-sm font-semibold text-white transition duration-200 hover:scale-[1.02] hover:border-white hover:bg-white/10";

export function HeroSlider({ slides }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) {
        return;
      }

      setIsTransitioning(true);
      setActiveIndex((index + slides.length) % slides.length);
      window.setTimeout(() => setIsTransitioning(false), 300);
    },
    [isTransitioning, slides.length],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const interval = window.setInterval(goNext, 6000);
    return () => window.clearInterval(interval);
  }, [goNext]);

  const slide = slides[activeIndex];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-atres-primary shadow-soft">
      <div
        className={
          "relative min-h-[320px] transition-opacity duration-300 sm:min-h-[380px] lg:min-h-[420px] " +
          (isTransitioning ? "opacity-90" : "opacity-100")
        }
      >
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1280px"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-atres-primary/95 via-atres-primary/80 to-atres-primary/40" />
        <div className="relative flex h-full min-h-[320px] flex-col justify-center px-6 py-10 sm:min-h-[380px] sm:px-10 lg:min-h-[420px] lg:px-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-atres-gold">
            AtresColombia
          </p>
          <h2 className="mt-3 max-w-xl text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
            {slide.title}
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-white/85 sm:text-base">
            {slide.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={slide.primaryHref} className={primaryBtnClass}>
              {slide.primaryLabel}
            </Link>
            <Link href={slide.secondaryHref} className={secondaryBtnClass}>
              {slide.secondaryLabel}
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Slide anterior"
        onClick={goPrev}
        className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-atres-primary shadow-card transition duration-200 hover:scale-105 hover:bg-white"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        aria-label="Slide siguiente"
        onClick={goNext}
        className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-atres-primary shadow-card transition duration-200 hover:scale-105 hover:bg-white"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={"Ir al slide " + (index + 1)}
            onClick={() => goTo(index)}
            className={
              "h-2 cursor-pointer rounded-full transition-all duration-300 " +
              (index === activeIndex
                ? "w-6 bg-atres-gold"
                : "w-2 bg-white/50 hover:bg-white/80")
            }
          />
        ))}
      </div>
    </section>
  );
}
