"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/hooks/use-cart";
import {
  getPrimaryImageUrl,
  getProductColors,
  getProductSizes,
} from "@/lib/products/helpers";
import { FavoriteButton } from "@/components/products/favorite-button";
import { ProductMeta } from "@/components/products/product-meta";
import { ProductPrice } from "@/components/products/product-price";
import { PrimaryButton } from "@/components/ui/primary-button";

type ProductCatalogRowProps = {
  product: Product;
};

export function ProductCatalogRow({ product }: ProductCatalogRowProps) {
  const { addItem } = useCart();
  const colors = getProductColors(product);
  const sizes = getProductSizes(product);
  const primaryImage = getPrimaryImageUrl(product);

  const availabilityLabel = product.available
    ? product.madeToOrder
      ? "Disponible · Bajo pedido"
      : "Disponible · En inventario"
    : "No disponible";

  const handleAdd = () => {
    addItem({
      product,
      color: colors[0]?.name ?? "",
      size: sizes[0] ?? "",
    });
  };

  return (
    <article className="grid grid-cols-[112px_minmax(0,1fr)] gap-3 rounded-2xl border border-atres-border bg-atres-surface p-3 shadow-card sm:grid-cols-[140px_minmax(0,1fr)] sm:p-4">
      <Link
        href={"/productos/" + product.slug}
        className="relative aspect-[4/5] overflow-hidden rounded-xl bg-atres-bg"
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 112px, 140px"
          className="object-cover"
        />
      </Link>

      <div className="min-w-0 space-y-2">
        <div className="flex items-start gap-2">
          <Link href={"/productos/" + product.slug} className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold leading-5 text-atres-text sm:text-base">
              {product.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-atres-muted sm:text-sm">
              {product.description}
            </p>
          </Link>
          <FavoriteButton productId={product.id} variant="default" />
        </div>

        <ProductPrice
          price={product.price}
          previousPrice={product.previousPrice}
          discount={product.discount}
          size="sm"
        />

        <ProductMeta colors={colors} sizes={sizes} />

        <p className="text-xs font-medium text-atres-muted">{availabilityLabel}</p>

        <PrimaryButton tone="primary" size="sm" className="w-full sm:w-auto" onClick={handleAdd}>
          <Plus size={16} />
          Agregar al carrito
        </PrimaryButton>
      </div>
    </article>
  );
}
