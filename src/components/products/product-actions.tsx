"use client";

import { useRouter } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, Sparkles } from "lucide-react";
import type { Product } from "@/types/product";
import type { Workshop } from "@/types/workshop";
import { useCart } from "@/hooks/use-cart";
import { PrimaryButton } from "@/components/ui/primary-button";

type ProductActionsProps = {
  product: Product;
  workshop: Workshop;
  selectedColor: string;
  selectedSize: string;
};

export function ProductActions({
  product,
  workshop,
  selectedColor,
  selectedSize,
}: ProductActionsProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const disabled = !product.available || product.stockLevel === "out_of_stock";

  const handleAdd = () => {
    addItem({
      product,
      color: selectedColor,
      size: selectedSize,
    });
  };

  const handleBuyNow = () => {
    handleAdd();
    router.push("/carrito");
  };

  return (
    <section className="space-y-3">
      <PrimaryButton
        tone="primary"
        className="w-full"
        onClick={handleAdd}
        disabled={disabled}
      >
        <ShoppingCart size={18} />
        Agregar al carrito
      </PrimaryButton>

      <PrimaryButton
        tone="gold"
        className="w-full"
        onClick={handleBuyNow}
        disabled={disabled}
      >
        <ShoppingBag size={18} />
        Comprar ahora
      </PrimaryButton>

      <div className="grid gap-3 sm:grid-cols-2">
        {workshop.supportsCustomization ? (
          <PrimaryButton tone="ghost" className="w-full" disabled={disabled}>
            <Sparkles size={18} />
            Personalizar
          </PrimaryButton>
        ) : null}

        {workshop.supportsHomeTrial ? (
          <PrimaryButton tone="ghost" className="w-full" disabled={disabled}>
            <Home size={18} />
            Probar en casa
          </PrimaryButton>
        ) : null}
      </div>
    </section>
  );
}
