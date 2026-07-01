import type { Product } from "@/types/product";

type ProductBadgesProps = {
  product: Product;
  variant?: "overlay" | "inline";
};

export function ProductBadges({ product, variant = "overlay" }: ProductBadgesProps) {
  const badges: { label: string; className: string }[] = [];

  if (product.isNew) {
    badges.push({
      label: "Nuevo",
      className: "bg-atres-primary text-white",
    });
  }

  if (product.discount) {
    badges.push({
      label: "Oferta",
      className: "bg-atres-gold text-white",
    });
  }

  if (product.madeToOrder) {
    badges.push({
      label: "Bajo pedido",
      className: "bg-atres-bg text-atres-primary border border-atres-border",
    });
  }

  if (badges.length === 0) {
    return null;
  }

  const containerClass =
    variant === "overlay"
      ? "absolute left-3 top-3 flex flex-wrap gap-1.5"
      : "flex flex-wrap gap-2";

  return (
    <div className={containerClass}>
      {badges.map((badge) => (
        <span
          key={badge.label}
          className={
            "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide " +
            badge.className
          }
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}
