import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Clock, MapPin } from "lucide-react";
import type { Workshop } from "@/types/workshop";
import { getVerifiedLabel } from "@/lib/workshops/helpers";

type WorkshopSummaryProps = {
  workshop: Workshop;
};

export function WorkshopSummary({ workshop }: WorkshopSummaryProps) {
  const profileHref = "/talleres/" + workshop.slug;
  const specialty = workshop.specialties[0] ?? "Confeccion artesanal";

  return (
    <section className="rounded-2xl border border-atres-border bg-atres-bg p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-atres-muted">
        Fabricado por
      </p>

      <div className="mt-3 flex items-start gap-3">
        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-atres-border bg-white">
          <Image
            src={workshop.logo}
            alt={"Logo de " + workshop.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        </span>

        <div className="min-w-0 flex-1 space-y-2">
          <Link
            href={profileHref}
            className="block text-base font-bold text-atres-primary transition hover:underline sm:text-lg"
          >
            {workshop.name}
          </Link>

          <div className="flex flex-wrap gap-2">
            {workshop.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-atres-primary/10 px-2.5 py-1 text-xs font-semibold text-atres-primary">
                <BadgeCheck size={14} />
                {getVerifiedLabel(workshop)}
              </span>
            ) : null}
          </div>

          <p className="inline-flex items-center gap-1.5 text-sm text-atres-muted">
            <MapPin size={14} className="shrink-0 text-atres-gold" />
            {workshop.location}
          </p>

          <p className="inline-flex items-center gap-1.5 text-sm text-atres-muted">
            <Clock size={14} className="shrink-0 text-atres-gold" />
            {workshop.productionTime}
          </p>

          <p className="text-sm text-atres-text">
            <span className="font-semibold">Especialidad:</span> {specialty}
          </p>
        </div>
      </div>

      <Link
        href={profileHref}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-atres-border bg-atres-surface px-5 text-sm font-semibold text-atres-text transition duration-200 hover:border-atres-primary hover:text-atres-primary sm:w-auto"
      >
        Ver perfil del taller
      </Link>
    </section>
  );
}
