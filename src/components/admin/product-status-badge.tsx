import type { AdminProduct } from "@/types/admin-product";

type ProductStatusBadgeProps = {
  product: Pick<AdminProduct, "status" | "available" | "stockLevel" | "madeToOrder">;
};

export function ProductStatusBadge({ product }: ProductStatusBadgeProps) {
  if (product.status === "inactive") {
    return (
      <span className="rounded-full bg-atres-bg px-2.5 py-1 text-xs font-semibold text-atres-muted">
        Inactivo
      </span>
    );
  }

  if (product.stockLevel === "out_of_stock" || !product.available) {
    return (
      <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-800">
        Agotado
      </span>
    );
  }

  if (product.madeToOrder) {
    return (
      <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-900">
        Bajo pedido
      </span>
    );
  }

  if (product.stockLevel === "low_stock") {
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
        Pocas unidades
      </span>
    );
  }

  return (
    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
      Activo
    </span>
  );
}
