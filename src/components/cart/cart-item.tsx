"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { CartItem } from "@/types/product";
import { getCartLineSubtotal } from "@/lib/cart/helpers";
import { formatPrice } from "@/lib/format";
import { getCartItemKey } from "@/hooks/use-cart";
import { QuantitySelector } from "@/components/cart/quantity-selector";
import { IconButton } from "@/components/ui/icon-button";

type CartItemProps = {
  item: CartItem;
  onUpdateQuantity: (key: string, quantity: number) => void;
  onRemove: (key: string) => void;
};

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const key = getCartItemKey(item);
  const lineSubtotal = getCartLineSubtotal(item);

  return (
    <article className="grid grid-cols-[88px_minmax(0,1fr)] gap-3 rounded-2xl border border-atres-border bg-atres-surface p-3 shadow-card sm:grid-cols-[100px_minmax(0,1fr)] sm:gap-4 sm:p-4">
      <Link
        href={"/productos/" + item.slug}
        className="relative aspect-square overflow-hidden rounded-xl bg-atres-bg"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 88px, 100px"
          className="object-cover"
        />
      </Link>

      <div className="min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={"/productos/" + item.slug}
              className="block text-sm font-semibold leading-5 text-atres-text transition hover:text-atres-primary sm:text-base"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-xs text-atres-muted sm:text-sm">
              {item.workshopName}
            </p>
            <p className="mt-1 text-xs text-atres-muted sm:text-sm">
              Talla {item.size} · Color {item.color}
            </p>
          </div>

          <IconButton
            label="Eliminar producto"
            variant="ghost"
            onClick={() => onRemove(key)}
          >
            <Trash2 size={16} />
          </IconButton>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-atres-muted">Precio unitario</p>
            <p className="text-sm font-semibold text-atres-primary">
              {formatPrice(item.price)}
            </p>
          </div>

          <QuantitySelector
            quantity={item.quantity}
            onDecrease={() => onUpdateQuantity(key, item.quantity - 1)}
            onIncrease={() => onUpdateQuantity(key, item.quantity + 1)}
          />
        </div>

        <div className="flex items-center justify-between border-t border-atres-border/70 pt-2">
          <span className="text-xs text-atres-muted">Subtotal</span>
          <span className="text-sm font-bold text-atres-text">
            {formatPrice(lineSubtotal)}
          </span>
        </div>
      </div>
    </article>
  );
}
