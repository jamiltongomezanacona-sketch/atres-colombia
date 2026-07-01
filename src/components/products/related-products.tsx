import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types/product";

type RelatedProductsProps = {
  products: Product[];
};

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5 border-t border-atres-border pt-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-atres-gold">
          Tambien te puede gustar
        </p>
        <h2 className="mt-1 text-xl font-bold text-atres-text sm:text-2xl">
          Productos relacionados
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
