import type { ProductColor } from "@/types/product";

export function ColorDots({ colors }: { colors: ProductColor[] }) {
  return (
    <div className="flex items-center gap-1.5">
      {colors.map((color) => (
        <span
          key={color.name}
          className="h-4 w-4 rounded-full border border-atres-border"
          style={{ backgroundColor: color.value }}
          title={color.name}
        />
      ))}
    </div>
  );
}
