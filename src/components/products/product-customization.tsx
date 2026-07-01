import { Check } from "lucide-react";
import { CUSTOMIZATION_OPTIONS } from "@/lib/products/detail-helpers";

type ProductCustomizationProps = {
  enabled: boolean;
};

export function ProductCustomization({ enabled }: ProductCustomizationProps) {
  if (!enabled) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-atres-border bg-atres-surface p-4">
      <p className="text-sm font-semibold text-atres-text">Personalizacion disponible</p>
      <ul className="mt-3 space-y-2">
        {CUSTOMIZATION_OPTIONS.map((option) => (
          <li
            key={option}
            className="inline-flex w-full items-center gap-2 text-sm text-atres-muted"
          >
            <Check size={16} className="shrink-0 text-atres-primary" />
            {option}
          </li>
        ))}
      </ul>
    </section>
  );
}
