"use client";

import { useMemo } from "react";
import type { Product } from "@/types/product";
import type { Workshop } from "@/types/workshop";
import { ProductCard } from "@/components/products/product-card";
import { useCatalogFilterOptional } from "@/hooks/use-catalog-filter";
import { filterProducts } from "@/lib/catalog";

type WorkshopCatalogProps = {
  workshop: Workshop;
  products: Product[];
};

export function WorkshopCatalog({ workshop, products }: WorkshopCatalogProps) {
  const catalogFilter = useCatalogFilterOptional();
  const query = catalogFilter?.query ?? "";

  const visibleProducts = useMemo(
    () => filterProducts(products, query),
    [products, query],
  );

  return (
    <section id="catalogo" className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-atres-gold">
          Catalogo
        </p>
        <h2 className="mt-1 text-xl font-bold text-atres-text sm:text-2xl">
          Productos de {workshop.name}
        </h2>
        <p className="mt-2 text-sm text-atres-muted">
          Compra directo desde este punto de confeccion.
        </p>
      </div>

      {query && visibleProducts.length === 0 ? (
        <p className="rounded-2xl border border-atres-border bg-atres-surface px-6 py-10 text-center text-sm text-atres-muted">
          No hay productos que coincidan con &ldquo;{query}&rdquo; en este taller.
        </p>
      ) : null}

      {visibleProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : !query ? (
        <p className="rounded-2xl border border-atres-border bg-atres-surface px-6 py-10 text-center text-sm text-atres-muted">
          Este taller aun no tiene productos publicados.
        </p>
      ) : null}
    </section>
  );
}
