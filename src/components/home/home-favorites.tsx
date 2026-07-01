"use client";

import { useMemo } from "react";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/products/product-card";
import { useFavorites } from "@/hooks/use-favorites";

type HomeFavoritesProps = {
  products: Product[];
};

export function HomeFavorites({ products }: HomeFavoritesProps) {
  const { favorites } = useFavorites();

  const favoriteProducts = useMemo(
    () => products.filter((product) => favorites.includes(product.id)),
    [favorites, products],
  );

  if (favoriteProducts.length === 0) {
    return null;
  }

  return (
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
  );
}
