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
      <section className="rounded-2xl border border-atres-border bg-atres-surface p-8 text-center shadow-card">
        <h1 className="text-2xl font-bold text-atres-text">Tu carrito esta vacio</h1>
        <p className="mt-2 text-sm text-atres-muted">
          Agrega prendas del catalogo para preparar tu pedido directo al taller.
        </p>
        <PrimaryButton onClick={() => (window.location.href = "/")}>
          Ver catalogo
        </PrimaryButton>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-atres-gold">
          Pedido
        </p>
        <h1 className="mt-1 text-2xl font-bold text-atres-text sm:text-3xl">Carrito</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {items.map((item) => {
            const key = getCartItemKey(item);

            return (
              <article
                key={key}
                className="grid grid-cols-[100px_minmax(0,1fr)] gap-4 rounded-2xl border border-atres-border bg-atres-surface p-4 shadow-card"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-atres-bg">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <Link
                    href={"/productos/" + item.slug}
                    className="font-semibold text-atres-text transition hover:text-atres-primary"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-atres-muted">
                    {item.color} · Talla {item.size}
                  </p>
                  <p className="mt-2 font-bold text-atres-primary">
                    {formatPrice(item.price)}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <IconButton
                        label="Disminuir cantidad"
                        onClick={() => updateQuantity(key, item.quantity - 1)}
                      >
                        <Minus size={16} />
                      </IconButton>
                      <span className="min-w-6 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <IconButton
                        label="Aumentar cantidad"
                        onClick={() => updateQuantity(key, item.quantity + 1)}
                      >
                        <Plus size={16} />
                      </IconButton>
                    </div>
                    <IconButton
                      label="Eliminar producto"
                      variant="ghost"
                      onClick={() => removeItem(key)}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <aside className="h-fit rounded-2xl border border-atres-border bg-atres-surface p-5 shadow-card">
          <div className="flex items-center justify-between text-sm text-atres-muted">
            <span>Subtotal</span>
            <strong className="text-xl text-atres-text">{formatPrice(subtotal)}</strong>
          </div>
          <p className="mt-3 text-sm leading-6 text-atres-muted">
            El pago y envio se conectaran en una siguiente version. Por ahora el
            carrito conserva tu seleccion en este dispositivo.
          </p>
          <div className="mt-5 grid gap-3">
            <PrimaryButton className="w-full">Preparar pedido</PrimaryButton>
            <PrimaryButton tone="ghost" className="w-full" onClick={clearCart}>
              Vaciar carrito
            </PrimaryButton>
          </div>
        </aside>
      </div>
    </section>
  );
}
