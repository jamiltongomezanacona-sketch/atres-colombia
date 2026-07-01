"use client";

import { Check, Ruler, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types/product";
import { useCart } from "@/hooks/use-cart";
import { PrimaryButton } from "@/components/ui/primary-button";

export function ProductDetailActions({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const { addItem } = useCart();

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-semibold text-white">Colores</p>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color.name)}
              className={
                "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm " +
                (selectedColor === color.name
                  ? "border-atres-green text-atres-green"
                  : "border-atres-border text-atres-muted")
              }
            >
              <span
                className="h-4 w-4 rounded-full border border-white/30"
                style={{ backgroundColor: color.value }}
              />
              {color.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-white">Tallas</p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={
                "h-10 min-w-11 rounded-full border px-3 text-sm font-semibold " +
                (selectedSize === size
                  ? "border-atres-gold bg-atres-gold text-atres-black"
                  : "border-atres-border bg-white/5 text-white")
              }
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-2 rounded-lg border border-atres-border bg-white/[0.03] p-3 text-sm text-atres-muted">
        <span className="inline-flex items-center gap-2">
          <Check size={17} className="text-atres-green" />
          {product.available ? "Disponible" : "No disponible"}
        </span>
        <span className="inline-flex items-center gap-2">
          <Ruler size={17} className="text-atres-gold" />
          {product.madeToOrder
            ? "Fabricacion bajo pedido disponible"
            : "Entrega desde inventario del taller"}
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <PrimaryButton
          onClick={() =>
            addItem({
              product,
              color: selectedColor,
              size: selectedSize,
            })
          }
        >
          Probar en casa
        </PrimaryButton>
        <PrimaryButton tone="gold">
          <Sparkles size={18} />
          Personalizar
        </PrimaryButton>
      </div>
    </div>
  );
}
