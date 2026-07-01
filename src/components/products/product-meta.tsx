import { ColorDots } from "@/components/products/color-dots";
import type { ProductColor } from "@/types/product";

type ProductMetaProps = {
  colors: ProductColor[];
  sizes: string[];
};

export function ProductMeta({ colors, sizes }: ProductMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-atres-muted">
      <ColorDots colors={colors} />
      <span className="text-atres-muted/80">Tallas {sizes.join(" · ")}</span>
    </div>
  );
}
