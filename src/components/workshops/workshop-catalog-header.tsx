import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, MapPin, Star } from "lucide-react";
import type { Workshop } from "@/types/workshop";
import {
  getShortDescription,
  getVerifiedLabel,
} from "@/lib/workshops/helpers";

type WorkshopCatalogHeaderProps = {
  workshop: Workshop;
};

export function WorkshopCatalogHeader({ workshop }: WorkshopCatalogHeaderProps) {
  const verifiedLabel = getVerifiedLabel(workshop);

  return (
    <section className="space-y-4">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-atres-muted transition duration-200 hover:text-atres-primary"
      >
        <ArrowLeft size={18} />
        Volver a talleres
      </Link>

      <div className="overflow-hidden rounded-2xl border border-atres-border bg-atres-surface shadow-card">
        <div className="relative aspect-[21/9] min-h-[140px] bg-atres-bg sm:min-h-[180px]">
          <Image
            src={workshop.coverImage}
            alt={"Portada de " + workshop.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1280px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-end gap-3 sm:bottom-4 sm:left-4">
            <span className="relative h-12 w-12 overflow-hidden rounded-xl border-2 border-white bg-white shadow-md sm:h-14 sm:w-14">
              <Image
                src={workshop.logo}
                alt={"Logo de " + workshop.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </span>
            <div>
              <h1 className="text-lg font-bold text-white sm:text-2xl">
                {workshop.name}
              </h1>
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-white/90 sm:text-sm">
                <MapPin size={14} />
                {workshop.location}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            {workshop.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-atres-primary/10 px-2.5 py-1 text-xs font-semibold text-atres-primary">
                <BadgeCheck size={14} />
                {verifiedLabel}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 rounded-full bg-atres-bg px-2.5 py-1 text-xs font-semibold text-atres-text">
              <Star size={14} className="fill-atres-gold text-atres-gold" />
              {workshop.rating.toFixed(1)} ({workshop.reviewCount})
            </span>
            <span className="rounded-full bg-atres-bg px-2.5 py-1 text-xs text-atres-muted">
              {workshop.productCount}{" "}
              {workshop.productCount === 1 ? "producto" : "productos"}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {workshop.specialties.map((specialty) => (
              <span
                key={specialty}
                className="rounded-full border border-atres-border px-2.5 py-1 text-[11px] font-medium text-atres-text"
              >
                {specialty}
              </span>
            ))}
          </div>

          <p className="text-sm leading-6 text-atres-muted">
            {getShortDescription(workshop.description)}
          </p>
        </div>
      </div>
    </section>
  );
}
