import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Star,
} from "lucide-react";
import type { Workshop } from "@/types/workshop";
import { PrimaryButton } from "@/components/shared";

type WorkshopHeaderProps = {
  workshop: Workshop;
  backHref?: string;
  backLabel?: string;
  showCatalogLink?: boolean;
};

export function WorkshopHeader({
  workshop,
  backHref = "/#talleres",
  backLabel = "Volver a talleres",
  showCatalogLink = true,
}: WorkshopHeaderProps) {
  const whatsappUrl = workshop.whatsapp
    ? "https://wa.me/" + workshop.whatsapp
    : "#";
  const catalogHref = "/talleres/" + workshop.slug + "/catalogo";

  return (
    <section className="space-y-5">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm font-semibold text-atres-muted transition duration-200 hover:text-atres-primary"
      >
        <ArrowLeft size={18} />
        {backLabel}
      </Link>

      <div className="overflow-hidden rounded-2xl border border-atres-border bg-atres-surface shadow-card">
        <div className="relative aspect-[21/9] min-h-[160px] bg-atres-bg sm:min-h-[200px]">
          <Image
            src={workshop.coverImage}
            alt={"Portada de " + workshop.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1280px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-end gap-3">
            <span className="relative h-14 w-14 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-md sm:h-16 sm:w-16">
              <Image
                src={workshop.logo}
                alt={"Logo de " + workshop.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </span>
            <div>
              <h1 className="text-xl font-bold text-white sm:text-2xl">
                {workshop.name}
              </h1>
              <p className="mt-0.5 inline-flex items-center gap-1 text-sm text-white/85">
                <MapPin size={14} />
                {workshop.location}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-atres-bg px-3 py-1.5 text-sm font-semibold text-atres-text">
              <Star size={15} className="fill-atres-gold text-atres-gold" />
              {workshop.rating.toFixed(1)} ({workshop.reviewCount} reseñas)
            </span>
            {workshop.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-atres-primary/10 px-3 py-1.5 text-xs font-semibold text-atres-primary">
                <BadgeCheck size={14} />
                Taller verificado
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 rounded-full bg-atres-bg px-3 py-1.5 text-xs font-medium text-atres-muted">
              <Clock size={14} />
              {workshop.productionTime}
            </span>
            <span className="rounded-full bg-atres-bg px-3 py-1.5 text-xs font-medium text-atres-muted">
              {workshop.productCount}{" "}
              {workshop.productCount === 1 ? "producto" : "productos"}
            </span>
          </div>

          <p className="text-sm leading-7 text-atres-muted sm:text-base">
            {workshop.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {workshop.specialties.map((specialty) => (
              <span
                key={specialty}
                className="rounded-full border border-atres-border px-3 py-1 text-xs font-medium text-atres-text"
              >
                {specialty}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <PrimaryButton tone="primary" className="w-full sm:w-auto">
                <MessageCircle size={18} />
                Hablar con el taller
              </PrimaryButton>
            </a>
            {showCatalogLink ? (
              <Link href={catalogHref}>
                <PrimaryButton tone="ghost" className="w-full sm:w-auto">
                  <ShoppingBag size={18} />
                  Ver catalogo
                </PrimaryButton>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
