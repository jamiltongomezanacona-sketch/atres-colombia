"use client";

import { useMemo } from "react";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { CatalogSection } from "@/components/catalog/catalog-section";
import { CategoryStrip } from "@/components/catalog/category-strip";
import { ProductCard } from "@/components/products/product-card";
import { useCatalogFilter } from "@/hooks/use-catalog-filter";
import { useFavorites } from "@/hooks/use-favorites";
import { filterProducts, groupProductsByCategory } from "@/lib/catalog";

type HomeCatalogProps = {
  categories: Category[];
  products: Product[];
};

export function HomeCatalog({ categories, products }: HomeCatalogProps) {
  const { query, activeCategory } = useCatalogFilter();
  const { favorites } = useFavorites();

  const filteredProducts = useMemo(
    () => filterProducts(products, query),
    [products, query],
  );

  const catalogSections = useMemo(
    () => groupProductsByCategory(filteredProducts, categories),
    [categories, filteredProducts],
  );

  const visibleSections = useMemo(() => {
    if (!activeCategory) {
      return catalogSections;
    }

    return catalogSections.filter(
      (section) => section.category.id === activeCategory,
    );
  }, [activeCategory, catalogSections]);

  const favoriteProducts = useMemo(
    () => filteredProducts.filter((product) => favorites.includes(product.id)),
    [favorites, filteredProducts],
  );

  const totalVisibleProducts = visibleSections.reduce(
    (total, section) => total + section.products.length,
    0,
  );

  return (
    <div className="space-y-4">
      <CategoryStrip categories={categories} />
      <div id="catalogo" className="space-y-8">
        {query && totalVisibleProducts === 0 ? (
          <p className="rounded-lg border border-atres-border bg-atres-panel/80 px-4 py-6 text-center text-sm text-atres-muted">
            No encontramos prendas para &ldquo;{query}&rdquo;. Prueba con otro
            nombre o categoria.
          </p>
        ) : null}
        {visibleSections.map((section) => (
          <CatalogSection
            key={section.category.id}
            category={section.category}
            products={section.products}
          />
        ))}
      </div>
      {favoriteProducts.length > 0 ? (
        <section id="favoritos" className="scroll-mt-[8.75rem] space-y-3 md:scroll-mt-28">
          <div className="flex items-end justify-between gap-3 border-b border-atres-border/70 pb-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-atres-gold">
                Guardados
              </p>
              <h2 className="text-xl font-bold text-white">Tus favoritos</h2>
            </div>
            <span className="rounded-full border border-atres-border px-2.5 py-1 text-xs text-atres-muted">
              {favoriteProducts.length}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {favoriteProducts.map((product) => (
              <ProductCard key={"favorite-" + product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
