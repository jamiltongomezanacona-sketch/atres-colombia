import { BadgeCheck, MapPin } from "lucide-react";
import type { CartWorkshopGroup } from "@/types/cart";
import { formatPrice } from "@/lib/format";
import { getVerifiedLabelFromKind } from "@/lib/workshops/helpers";
import { CartItem } from "@/components/cart/cart-item";

type CartWorkshopGroupProps = {
  group: CartWorkshopGroup;
  onUpdateQuantity: (key: string, quantity: number) => void;
  onRemove: (key: string) => void;
};

export function CartWorkshopGroupSection({
  group,
  onUpdateQuantity,
  onRemove,
}: CartWorkshopGroupProps) {
  const verifiedLabel = getVerifiedLabelFromKind(group.workshopKind);

  const productLabel =
    group.itemCount === 1 ? "1 producto" : group.itemCount + " productos";

  return (
    <section className="overflow-hidden rounded-2xl border border-atres-border bg-atres-surface shadow-card">
      <header className="border-b border-atres-border bg-atres-bg px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-atres-text">{group.workshopName}</h2>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-atres-muted">
              <MapPin size={14} className="shrink-0 text-atres-gold" />
              {group.workshopLocation}
            </p>
          </div>

          <span className="rounded-full bg-atres-primary/10 px-2.5 py-1 text-xs font-semibold text-atres-primary">
            <BadgeCheck size={12} className="mr-1 inline" />
            {verifiedLabel}
          </span>
        </div>

        <p className="mt-2 text-xs font-medium text-atres-muted">{productLabel}</p>
      </header>

      <div className="space-y-3 p-3 sm:space-y-4 sm:p-4">
        {group.items.map((item) => (
          <CartItem
            key={item.productId + item.color + item.size}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>

      <footer className="border-t border-atres-border bg-atres-bg px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-atres-text">Subtotal taller</span>
          <span className="text-base font-bold text-atres-primary">
            {formatPrice(group.subtotal)}
          </span>
        </div>
      </footer>
    </section>
  );
}
