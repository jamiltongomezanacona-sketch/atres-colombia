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
    <section id={category.id} className="scroll-mt-36 space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-atres-gold">
            Coleccion
          </p>
          <h2 className="text-xl font-bold text-atres-text sm:text-2xl">
            {category.name}
          </h2>
        </div>
        <span className="rounded-full bg-atres-bg px-3 py-1 text-xs font-medium text-atres-muted">
          {products.length} {products.length === 1 ? "prenda" : "prendas"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
