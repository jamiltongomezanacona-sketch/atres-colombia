"use client";

import { useRouter } from "next/navigation";
import { Check, Clock, Package, Ruler, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types/product";
import { useCart } from "@/hooks/use-cart";
import { PrimaryButton } from "@/components/ui/primary-button";

export function ProductDetailActions({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const { addItem } = useCart();
  const router = useRouter();

  const handleAdd = () => {
    addItem({
      product,
      color: selectedColor,
      size: selectedSize,
    });
  };

  const handleBuy = () => {
    handleAdd();
    router.push("/carrito");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-semibold text-atres-text">Colores</p>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => setSelectedColor(color.name)}
              className={
                "inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition duration-200 " +
                (selectedColor === color.name
                  ? "border-atres-primary bg-atres-primary/5 text-atres-primary"
                  : "border-atres-border text-atres-muted hover:border-atres-primary")
              }
            >
              <span
                className="h-4 w-4 rounded-full border border-atres-border"
                style={{ backgroundColor: color.value }}
              />
              {color.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-atres-text">Tallas</p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={
                "h-11 min-w-11 cursor-pointer rounded-xl border px-4 text-sm font-semibold transition duration-200 " +
                (selectedSize === size
                  ? "border-atres-primary bg-atres-primary text-white"
                  : "border-atres-border bg-atres-surface text-atres-text hover:border-atres-primary")
              }
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-atres-border bg-atres-bg p-4 text-sm text-atres-muted">
        <span className="inline-flex items-center gap-2">
          <Check size={17} className="text-atres-primary" />
          {product.available ? "Disponible" : "No disponible"}
        </span>
        {product.material ? (
          <span className="inline-flex items-center gap-2">
            <Package size={17} className="text-atres-gold" />
            Material: {product.material}
          </span>
        ) : null}
        {product.fabricationTime ? (
          <span className="inline-flex items-center gap-2">
            <Clock size={17} className="text-atres-gold" />
            Tiempo: {product.fabricationTime}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-2">
          <Ruler size={17} className="text-atres-gold" />
          {product.madeToOrder
            ? "Fabricacion bajo pedido disponible"
            : "Entrega desde inventario del taller"}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <PrimaryButton onClick={handleBuy} className="w-full">
          <ShoppingBag size={18} />
          Comprar
        </PrimaryButton>
        <PrimaryButton tone="gold" className="w-full">
          <Sparkles size={18} />
          Personalizar
        </PrimaryButton>
        <PrimaryButton tone="ghost" onClick={handleAdd} className="w-full">
          Probar en casa
        </PrimaryButton>
      </div>
    </div>
  );
}
