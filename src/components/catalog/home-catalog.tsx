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
    <div className="space-y-8">
      <CategoryStrip categories={categories} />
      <div id="catalogo" className="space-y-10">
        {query && totalVisibleProducts === 0 ? (
          <p className="rounded-2xl border border-atres-border bg-atres-surface px-6 py-10 text-center text-sm text-atres-muted">
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
        <section id="favoritos" className="scroll-mt-36 space-y-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-atres-gold">
                Guardados
              </p>
              <h2 className="text-xl font-bold text-atres-text sm:text-2xl">
                Tus favoritos
              </h2>
            </div>
            <span className="rounded-full bg-atres-bg px-3 py-1 text-xs font-medium text-atres-muted">
              {favoriteProducts.length}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteProducts.map((product) => (
              <ProductCard key={"favorite-" + product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
