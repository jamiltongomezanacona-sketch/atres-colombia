import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, BadgeCheck } from "lucide-react";
import type { Workshop } from "@/types/workshop";
import { getVerifiedLabel } from "@/lib/workshops/helpers";
import { PrimaryButton } from "@/components/shared";

type WorkshopCardProps = {
  workshop: Workshop;
};

export function WorkshopCard({ workshop }: WorkshopCardProps) {
  const catalogHref = "/talleres/" + workshop.slug + "/catalogo";
  const verifiedLabel = getVerifiedLabel(workshop);

  return (
    <article className="group overflow-hidden rounded-2xl border border-atres-border bg-atres-surface shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <Link
        href={catalogHref}
        className="relative block aspect-[16/10] overflow-hidden bg-atres-bg"
      >
        <Image
          src={workshop.coverImage}
          alt={"Portada de " + workshop.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="relative h-10 w-10 overflow-hidden rounded-xl border-2 border-white bg-white shadow-sm">
            <Image
              src={workshop.logo}
              alt={"Logo de " + workshop.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </span>
          {workshop.verified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-atres-primary/90 px-2.5 py-1 text-[10px] font-semibold text-white">
              <BadgeCheck size={12} />
              {verifiedLabel}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <div>
          <Link href={catalogHref}>
            <h3 className="text-base font-bold text-atres-text transition group-hover:text-atres-primary sm:text-lg">
              {workshop.name}
            </h3>
          </Link>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-atres-muted sm:text-sm">
            <MapPin size={14} className="shrink-0 text-atres-gold" />
            {workshop.location}
          </p>
        </div>

        <p className="line-clamp-2 text-sm leading-5 text-atres-muted">
          {workshop.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {workshop.specialties.slice(0, 3).map((specialty) => (
            <span
              key={specialty}
              className="rounded-full bg-atres-bg px-2.5 py-1 text-[11px] font-medium text-atres-text"
            >
              {specialty}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="inline-flex items-center gap-1 font-semibold text-atres-text">
            <Star size={15} className="fill-atres-gold text-atres-gold" />
            {workshop.rating.toFixed(1)}
            <span className="font-normal text-atres-muted">
              ({workshop.reviewCount})
            </span>
          </span>
          <span className="text-xs text-atres-muted">
            {workshop.productCount}{" "}
            {workshop.productCount === 1 ? "producto" : "productos"}
          </span>
        </div>

        <Link href={catalogHref} className="block pt-1">
          <PrimaryButton tone="primary" size="sm" className="w-full">
            Ver catalogo
          </PrimaryButton>
        </Link>
      </div>
    </article>
  );
}
