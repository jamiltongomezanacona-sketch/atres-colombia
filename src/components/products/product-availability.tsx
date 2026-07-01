import { Clock3 } from "lucide-react";
import type { Product } from "@/types/product";
import { getProductAvailability } from "@/lib/products/detail-helpers";

type ProductAvailabilityProps = {
  product: Product;
};

const toneClasses = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  info: "border-sky-200 bg-sky-50 text-sky-900",
  danger: "border-rose-200 bg-rose-50 text-rose-900",
};

export function ProductAvailability({ product }: ProductAvailabilityProps) {
  const availability = getProductAvailability(product);

  return (
    <section
      className={
        "rounded-2xl border p-4 " + toneClasses[availability.tone]
      }
    >
      <p className="text-sm font-bold">{availability.label}</p>
      <p className="mt-1 inline-flex items-start gap-2 text-sm leading-6 opacity-90">
        <Clock3 size={16} className="mt-0.5 shrink-0" />
        {availability.detail}
      </p>
    </section>
  );
}
