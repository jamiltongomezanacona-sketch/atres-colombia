"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import type { Workshop } from "@/types/workshop";
import { ProductCatalogRow } from "@/components/products/product-catalog-row";
import { WorkshopCatalogFilters } from "@/components/workshops/workshop-catalog-filters";
import { WorkshopCatalogHeader } from "@/components/workshops/workshop-catalog-header";
import { WorkshopCatalogSearch } from "@/components/workshops/workshop-catalog-search";
import {
  filterProductsByCategory,
  getCategoriesForProducts,
} from "@/lib/catalog/workshop-catalog";
import { filterProducts } from "@/lib/catalog";

type WorkshopCatalogViewProps = {
  workshop: Workshop;
  products: Product[];
};

export function WorkshopCatalogView({
  workshop,
  products,
}: WorkshopCatalogViewProps) {
  const [query, setQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const categories = useMemo(
    () => getCategoriesForProducts(products),
    [products],
  );

  const visibleProducts = useMemo(() => {
    const bySearch = filterProducts(products, query);
    return filterProductsByCategory(bySearch, activeCategoryId);
  }, [activeCategoryId, products, query]);

  const hasFilters = query.length > 0 || activeCategoryId !== null;
  const isEmpty = products.length === 0;
  const noResults = !isEmpty && visibleProducts.length === 0;

  return (
    <div className="space-y-5 sm:space-y-6">
      <WorkshopCatalogHeader workshop={workshop} />

      {!isEmpty ? (
        <div className="space-y-4">
          <WorkshopCatalogSearch query={query} onQueryChange={setQuery} />
          <WorkshopCatalogFilters
            categories={categories}
            activeCategoryId={activeCategoryId}
            onCategoryChange={setActiveCategoryId}
          />
        </div>
      ) : null}

      {isEmpty ? (
        <p className="rounded-2xl border border-atres-border bg-atres-surface px-6 py-10 text-center text-sm text-atres-muted">
          Este taller aún no tiene productos publicados.
        </p>
      ) : null}

      {noResults ? (
        <p className="rounded-2xl border border-atres-border bg-atres-surface px-6 py-10 text-center text-sm text-atres-muted">
          {hasFilters
            ? "No encontramos productos con esos filtros en este taller."
            : "Este taller aún no tiene productos publicados."}
        </p>
      ) : null}

      {visibleProducts.length > 0 ? (
        <div id="catalogo" className="flex flex-col gap-3">
          {visibleProducts.map((product) => (
            <ProductCatalogRow key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
