import type { ProductColor } from "@/types/product";

type ProductColorsProps = {
  colors: ProductColor[];
  selectedColor: string;
  onColorChange: (colorName: string) => void;
};

export function ProductColors({
  colors,
  selectedColor,
  onColorChange,
}: ProductColorsProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-atres-text">Colores</p>
        <p className="text-xs text-atres-muted">{selectedColor}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const selected = selectedColor === color.name;

          return (
            <button
              key={color.name}
              type="button"
              aria-label={"Color " + color.name}
              aria-pressed={selected}
              onClick={() => onColorChange(color.name)}
              className={
                "relative h-10 w-10 rounded-full border-2 transition duration-200 hover:scale-105 " +
                (selected
                  ? "border-atres-primary ring-2 ring-atres-primary/25"
                  : "border-atres-border")
              }
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          );
        })}
      </div>
    </section>
  );
}
