"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { getCartItemKey, useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/format";
import { IconButton } from "@/components/ui/icon-button";
import { PrimaryButton } from "@/components/ui/primary-button";

export function CartView() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <section className="rounded-lg border border-atres-border bg-atres-panel p-6 text-center">
        <h1 className="text-2xl font-bold text-white">Tu carrito esta vacio</h1>
        <p className="mt-2 text-sm text-atres-muted">
          Agrega prendas del catalogo para preparar tu pedido directo al taller.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-atres-green bg-atres-green px-5 text-sm font-semibold text-atres-black"
        >
          Ver catalogo
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-atres-gold">Pedido</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Carrito</h1>
      </div>
      <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {items.map((item) => {
            const key = getCartItemKey(item);

            return (
              <article
                key={key}
                className="grid grid-cols-[92px_minmax(0,1fr)] gap-3 rounded-lg border border-atres-border bg-atres-panel p-3"
              >
                <div className="relative aspect-square overflow-hidden rounded-md bg-white/5">
                  <Image src={item.image} alt={item.name} fill sizes="92px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <Link href={"/productos/" + item.slug} className="font-semibold text-white">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-atres-muted">
                    {item.color} - Talla {item.size}
                  </p>
                  <p className="mt-2 font-bold text-atres-green">{formatPrice(item.price)}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <IconButton label="Disminuir cantidad" onClick={() => updateQuantity(key, item.quantity - 1)}>
                        <Minus size={16} />
                      </IconButton>
                      <span className="min-w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <IconButton label="Aumentar cantidad" onClick={() => updateQuantity(key, item.quantity + 1)}>
                        <Plus size={16} />
                      </IconButton>
                    </div>
                    <IconButton label="Eliminar producto" onClick={() => removeItem(key)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <aside className="h-fit rounded-lg border border-atres-border bg-atres-panel p-4">
          <div className="flex items-center justify-between text-sm text-atres-muted">
            <span>Subtotal</span>
            <strong className="text-lg text-white">{formatPrice(subtotal)}</strong>
          </div>
          <p className="mt-3 text-sm leading-6 text-atres-muted">
            El pago y envio se conectaran en una siguiente version. Por ahora el carrito conserva tu seleccion en este dispositivo.
          </p>
          <div className="mt-4 grid gap-2">
            <PrimaryButton>Preparar pedido</PrimaryButton>
            <PrimaryButton tone="dark" onClick={clearCart}>
              Vaciar carrito
            </PrimaryButton>
          </div>
        </aside>
      </div>
    </section>
  );
}
