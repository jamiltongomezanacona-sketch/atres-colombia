"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/hooks/use-cart";
import {
  getPrimaryImageUrl,
  getProductColors,
  getProductSizes,
} from "@/lib/products/helpers";
import { FavoriteButton } from "@/components/products/favorite-button";
import { ProductBadges } from "@/components/products/product-badges";
import { ProductMeta } from "@/components/products/product-meta";
import { ProductPrice } from "@/components/products/product-price";
import { PrimaryButton } from "@/components/ui/primary-button";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const colors = getProductColors(product);
  const sizes = getProductSizes(product);
  const primaryImage = getPrimaryImageUrl(product);

  const handleAdd = () => {
    addItem({
      product,
      color: colors[0]?.name ?? "",
      size: sizes[0] ?? "",
    });
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-atres-border bg-atres-surface shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative">
        <Link
          href={"/productos/" + product.slug}
          className="relative block aspect-[3/4] overflow-hidden rounded-t-2xl bg-atres-bg"
        >
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          <ProductBadges product={product} />
        </Link>
        <div className="absolute right-3 top-3">
          <FavoriteButton productId={product.id} />
        </div>
      </div>

      <div className="space-y-3 p-4">
        <Link href={"/productos/" + product.slug} className="block">
          <h3 className="line-clamp-1 text-sm font-semibold text-atres-text transition group-hover:text-atres-primary sm:text-base">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-atres-muted sm:text-sm">
            {product.description}
          </p>
        </Link>

        <ProductPrice
          price={product.price}
          previousPrice={product.previousPrice}
          discount={product.discount}
          size="sm"
        />

        <ProductMeta colors={colors} sizes={sizes} />

        <p className="text-xs font-medium text-atres-muted">
          {product.available
            ? product.madeToOrder
              ? "Disponible · Fabricacion bajo pedido"
              : "Disponible · En inventario"
            : "No disponible"}
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <PrimaryButton
            tone="ghost"
            size="sm"
            className="w-full"
            onClick={handleAdd}
          >
            <Plus size={16} />
            Agregar
          </PrimaryButton>
          <Link href={"/productos/" + product.slug} className="w-full">
            <PrimaryButton tone="primary" size="sm" className="w-full">
              <ShoppingBag size={16} />
              Ver
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </article>
  );
}
