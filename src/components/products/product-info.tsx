import { Star } from "lucide-react";
import type { Product } from "@/types/product";
import { ProductPrice } from "@/components/products/product-price";

type ProductInfoProps = {
  product: Product;
};

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-atres-gold">
          {product.categoryName}
        </p>
        <h1 className="mt-1 text-2xl font-bold leading-tight text-atres-text sm:text-3xl lg:text-4xl">
          {product.name}
        </h1>
        <p className="mt-2 text-sm leading-6 text-atres-muted">{product.description}</p>
      </div>

      <ProductPrice
        price={product.price}
        previousPrice={product.previousPrice}
        discount={product.discount}
        size="lg"
      />

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="inline-flex items-center gap-1.5 font-semibold text-atres-text">
          <Star size={16} className="fill-atres-gold text-atres-gold" />
          {product.rating.toFixed(1)}
        </span>
        <span className="text-atres-muted">
          {product.reviewCount} reseñas
        </span>
        <span className="text-atres-muted">
          {product.soldCount}+ vendidos
        </span>
      </div>
    </section>
  );
}
