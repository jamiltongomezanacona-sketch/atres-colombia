"use client";

import { Minus, Plus } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";

type QuantitySelectorProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
}: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-atres-border bg-atres-bg px-1 py-1">
      <IconButton label="Disminuir cantidad" onClick={onDecrease}>
        <Minus size={16} />
      </IconButton>
      <span className="min-w-8 text-center text-sm font-semibold text-atres-text">
        {quantity}
      </span>
      <IconButton label="Aumentar cantidad" onClick={onIncrease}>
        <Plus size={16} />
      </IconButton>
    </div>
  );
}
