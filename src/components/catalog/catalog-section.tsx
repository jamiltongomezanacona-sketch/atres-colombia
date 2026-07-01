import type { Product } from "@/types/product";
import { ProductCard } from "@/components/products/product-card";
import type { Category } from "@/types/category";

type CatalogSectionProps = {
  category: Category;
  products: Product[];
};

export function CatalogSection({ category, products }: CatalogSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section
      id={category.id}
      className="scroll-mt-[8.75rem] space-y-3 md:scroll-mt-28"
    >
      <div className="flex items-end justify-between gap-3 border-b border-atres-border/70 pb-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-atres-gold">
            Categoria
          </p>
          <h2 className="text-xl font-bold text-white">{category.name}</h2>
        </div>
        <span className="rounded-full border border-atres-border px-2.5 py-1 text-xs text-atres-muted">
          {products.length} {products.length === 1 ? "prenda" : "prendas"}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
