import type { Product } from "@/types/product";
import { ProductCard } from "@/components/products/product-card";

type CatalogListProps = {
  products: Product[];
};

export function CatalogList({ products }: CatalogListProps) {
  return (
    <section id="catalogo" className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-atres-gold">
            Directo del taller
          </p>
          <h1 className="mt-1 text-2xl font-bold text-atres-text sm:text-3xl">
            Catalogo AtresColombia
          </h1>
        </div>
        <span className="hidden rounded-full bg-atres-bg px-3 py-1 text-sm text-atres-muted sm:block">
          {products.length} prendas
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
