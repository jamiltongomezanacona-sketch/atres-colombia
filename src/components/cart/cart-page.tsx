"use client";

import { useCart } from "@/hooks/use-cart";
import { CartSummary } from "@/components/cart/cart-summary";
import { CartWorkshopGroupSection } from "@/components/cart/cart-workshop-group";
import { EmptyCart } from "@/components/cart/empty-cart";

export function CartPage() {
  const {
    groups,
    subtotal,
    shipping,
    total,
    removeItem,
    updateQuantity,
    clearCart,
    items,
  } = useCart();

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <section className="space-y-6 pb-24 sm:space-y-8 lg:pb-0">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-atres-gold">
          Pedido por taller
        </p>
        <h1 className="mt-1 text-2xl font-bold text-atres-text sm:text-3xl">Carrito</h1>
        <p className="mt-2 text-sm text-atres-muted">
          Tus productos estan agrupados por el taller que los fabrica.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
        <div className="space-y-5">
          {groups.map((group) => (
            <CartWorkshopGroupSection
              key={group.workshopId}
              group={group}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        <div className="hidden lg:block">
          <CartSummary
            groups={groups}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            onClearCart={clearCart}
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-[4.5rem] z-30 border-t border-atres-border bg-atres-surface/95 p-4 backdrop-blur lg:hidden">
        <CartSummary
          groups={groups}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          onClearCart={clearCart}
          compact
        />
      </div>
    </section>
  );
}
