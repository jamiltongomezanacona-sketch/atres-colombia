"use client";

import { useMemo } from "react";
import type { Workshop } from "@/types/workshop";
import { WorkshopCard } from "@/components/workshops/workshop-card";
import { useCatalogFilter } from "@/hooks/use-catalog-filter";
import { filterWorkshops } from "@/lib/workshops";

type WorkshopListProps = {
  workshops: Workshop[];
};

export function WorkshopList({ workshops }: WorkshopListProps) {
  const { query } = useCatalogFilter();

  const visibleWorkshops = useMemo(
    () => filterWorkshops(workshops, query),
    [workshops, query],
  );

  return (
    <section id="talleres" className="scroll-mt-36 space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-atres-gold">
          Puntos de confeccion
        </p>
        <h2 className="mt-1 text-xl font-bold text-atres-text sm:text-2xl">
          Explora por talleres y tiendas
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-atres-muted">
          Cada taller y tienda tiene su propio catalogo. Compra directo desde quien
          confecciona.
        </p>
      </div>

      {query && visibleWorkshops.length === 0 ? (
        <p className="rounded-2xl border border-atres-border bg-atres-surface px-6 py-10 text-center text-sm text-atres-muted">
          No encontramos talleres para &ldquo;{query}&rdquo;. Prueba con otra
          ciudad o especialidad.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleWorkshops.map((workshop) => (
          <WorkshopCard key={workshop.id} workshop={workshop} />
        ))}
      </div>
    </section>
  );
}
