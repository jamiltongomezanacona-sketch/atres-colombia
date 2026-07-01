import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types/product";

type RelatedProductsProps = {
  sameWorkshopProducts: Product[];
  suggestedProducts: Product[];
  workshopName: string;
};

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function RelatedProducts({
  sameWorkshopProducts,
  suggestedProducts,
  workshopName,
}: RelatedProductsProps) {
  if (sameWorkshopProducts.length === 0 && suggestedProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-10 border-t border-atres-border pt-8">
      {sameWorkshopProducts.length > 0 ? (
        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-atres-gold">
              Del mismo taller
            </p>
            <h2 className="mt-1 text-xl font-bold text-atres-text sm:text-2xl">
              Mas productos de {workshopName}
            </h2>
          </div>
          <ProductGrid products={sameWorkshopProducts} />
        </section>
      ) : null}

      {suggestedProducts.length > 0 ? (
        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-atres-gold">
              Tambien podria interesarte
            </p>
            <h2 className="mt-1 text-xl font-bold text-atres-text sm:text-2xl">
              Productos relacionados
            </h2>
          </div>
          <ProductGrid products={suggestedProducts} />
        </section>
      ) : null}
    </div>
  );
}
