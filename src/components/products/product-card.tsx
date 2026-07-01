"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/hooks/use-cart";
import { FavoriteButton } from "@/components/products/favorite-button";
import { ProductMeta } from "@/components/products/product-meta";
import { ProductPrice } from "@/components/products/product-price";
import { PrimaryButton } from "@/components/ui/primary-button";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="overflow-hidden rounded-xl border border-atres-border bg-atres-panel/90 shadow-soft">
      <Link
        href={"/productos/" + product.slug}
        className="relative block aspect-[4/5] w-full bg-white/5"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-cover"
        />
        {product.discount ? (
          <span className="absolute left-3 top-3 rounded-full bg-atres-gold px-2.5 py-1 text-xs font-bold text-atres-black">
            -{product.discount}
          </span>
        ) : null}
      </Link>
      <div className="space-y-3 p-3.5">
        <div className="flex items-start gap-2">
          <Link href={"/productos/" + product.slug} className="min-w-0 flex-1">
            <h3 className="text-base font-semibold leading-5 text-white">
              {product.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-atres-muted">
              {product.description}
            </p>
          </Link>
          <FavoriteButton productId={product.id} />
        </div>
        <ProductPrice
          price={product.price}
          previousPrice={product.previousPrice}
        />
        <ProductMeta colors={product.colors} sizes={product.sizes} />
        <PrimaryButton
          className="w-full"
          onClick={() =>
            addItem({
              product,
              color: product.colors[0].name,
              size: product.sizes[0],
            })
          }
        >
          <Plus size={18} />
          Agregar al carrito
        </PrimaryButton>
      </div>
    </article>
  );
}
