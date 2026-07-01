"use client";

import { useState } from "react";
import { Ruler, X } from "lucide-react";

const SIZE_GUIDE = [
  { size: "XS", chest: "82-86", waist: "66-70", hip: "88-92" },
  { size: "S", chest: "86-90", waist: "70-74", hip: "92-96" },
  { size: "M", chest: "90-96", waist: "74-80", hip: "96-102" },
  { size: "L", chest: "96-102", waist: "80-86", hip: "102-108" },
  { size: "XL", chest: "102-108", waist: "86-92", hip: "108-114" },
  { size: "XXL", chest: "108-114", waist: "92-98", hip: "114-120" },
];

type ProductSizesProps = {
  sizes: string[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
};

export function ProductSizes({
  sizes,
  selectedSize,
  onSizeChange,
}: ProductSizesProps) {
  const [guideOpen, setGuideOpen] = useState(false);
  const hasStandardGuide = sizes.some((size) =>
    ["XS", "S", "M", "L", "XL", "XXL"].includes(size),
  );

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-atres-text">Tallas</p>
        {hasStandardGuide ? (
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-atres-primary transition hover:underline"
          >
            <Ruler size={14} />
            Guia de tallas
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            aria-pressed={selectedSize === size}
            onClick={() => onSizeChange(size)}
            className={
              "h-11 min-w-11 rounded-xl border px-4 text-sm font-semibold transition duration-200 " +
              (selectedSize === size
                ? "border-atres-primary bg-atres-primary text-white"
                : "border-atres-border bg-atres-surface text-atres-text hover:border-atres-primary")
            }
          >
            {size}
          </button>
        ))}
      </div>

      {guideOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
        >
          <div className="max-h-[85vh] w-full max-w-lg overflow-auto rounded-2xl bg-atres-surface p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 id="size-guide-title" className="text-lg font-bold text-atres-text">
                Guia de tallas
              </h3>
              <button
                type="button"
                aria-label="Cerrar guia de tallas"
                onClick={() => setGuideOpen(false)}
                className="rounded-full border border-atres-border p-2 text-atres-muted transition hover:text-atres-primary"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mb-4 text-sm text-atres-muted">
              Medidas orientativas en centimetros. Si tienes duda, el taller puede
              confirmar la talla ideal antes de confeccionar.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px] text-left text-sm">
                <thead>
                  <tr className="border-b border-atres-border text-atres-muted">
                    <th className="py-2 pr-3 font-semibold">Talla</th>
                    <th className="py-2 pr-3 font-semibold">Pecho</th>
                    <th className="py-2 pr-3 font-semibold">Cintura</th>
                    <th className="py-2 font-semibold">Cadera</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_GUIDE.map((row) => (
                    <tr key={row.size} className="border-b border-atres-border/70">
                      <td className="py-2 pr-3 font-semibold text-atres-text">
                        {row.size}
                      </td>
                      <td className="py-2 pr-3 text-atres-muted">{row.chest}</td>
                      <td className="py-2 pr-3 text-atres-muted">{row.waist}</td>
                      <td className="py-2 text-atres-muted">{row.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
