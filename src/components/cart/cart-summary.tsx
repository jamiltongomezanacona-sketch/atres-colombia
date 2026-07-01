"use client";

import { MessageCircle, ShoppingBag } from "lucide-react";
import type { CartWorkshopGroup } from "@/types/cart";
import { getCartWhatsAppUrl } from "@/lib/cart/whatsapp";
import { formatPrice } from "@/lib/format";
import { PrimaryButton } from "@/components/ui/primary-button";

type CartSummaryProps = {
  groups: CartWorkshopGroup[];
  subtotal: number;
  shipping: number;
  total: number;
  onClearCart: () => void;
  compact?: boolean;
};

const whatsAppButtonClass =
  "inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-atres-gold bg-atres-gold px-5 text-sm font-semibold text-white transition duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]";

export function CartSummary({
  groups,
  subtotal,
  shipping,
  total,
  onClearCart,
  compact = false,
}: CartSummaryProps) {
  const whatsAppUrl = getCartWhatsAppUrl(groups, shipping, total);

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-atres-muted">Total estimado</p>
          <p className="text-lg font-bold text-atres-primary">{formatPrice(total)}</p>
        </div>

        {whatsAppUrl ? (
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={
              whatsAppButtonClass + " w-auto min-w-[10.5rem] px-4"
            }
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>
        ) : (
          <PrimaryButton tone="gold" size="sm" disabled>
            WhatsApp
          </PrimaryButton>
        )}
      </div>
    );
  }

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="rounded-2xl border border-atres-border bg-atres-surface p-4 shadow-card sm:p-5">
        <h2 className="text-lg font-bold text-atres-text">Resumen de compra</h2>

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-atres-muted">Subtotal general</dt>
            <dd className="font-semibold text-atres-text">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-atres-muted">Costo de envio estimado</dt>
            <dd className="font-semibold text-atres-text">{formatPrice(shipping)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-atres-border pt-3">
            <dt className="text-base font-bold text-atres-text">Total</dt>
            <dd className="text-xl font-bold text-atres-primary">{formatPrice(total)}</dd>
          </div>
        </dl>

        <p className="mt-3 text-xs leading-5 text-atres-muted">
          Cada producto proviene del taller indicado. El envio es una estimacion
          simulada hasta conectar logistica real.
        </p>

        <div className="mt-5 grid gap-3">
          <PrimaryButton className="w-full" disabled>
            <ShoppingBag size={18} />
            Continuar compra
          </PrimaryButton>

          {whatsAppUrl ? (
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={whatsAppButtonClass}
            >
              <MessageCircle size={18} />
              Comprar por WhatsApp
            </a>
          ) : (
            <PrimaryButton tone="gold" className="w-full" disabled>
              <MessageCircle size={18} />
              Comprar por WhatsApp
            </PrimaryButton>
          )}

          <PrimaryButton tone="ghost" className="w-full" onClick={onClearCart}>
            Vaciar carrito
          </PrimaryButton>
        </div>
      </div>
    </aside>
  );
}
