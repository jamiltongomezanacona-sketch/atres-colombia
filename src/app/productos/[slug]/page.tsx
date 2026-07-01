import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductDetailActions } from "@/components/products/product-detail-actions";
import { ProductBadges } from "@/components/products/product-badges";
import { ProductPrice } from "@/components/products/product-price";
import { RelatedProducts } from "@/components/products/related-products";
import { getProductBySlug, getRelatedProducts, products } from "@/data/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(slug);

  return (
    <article className="space-y-8 animate-slide-up">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-atres-muted transition duration-200 hover:text-atres-primary"
      >
        <ArrowLeft size={18} />
        Volver al catalogo
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery name={product.name} images={product.images} />

        <section className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-atres-gold">{product.category}</p>
            <h1 className="mt-2 text-2xl font-bold text-atres-text sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>
            <ProductBadges product={product} variant="inline" />
          </div>

          <ProductPrice
            price={product.price}
            previousPrice={product.previousPrice}
            discount={product.discount}
            size="lg"
          />

          <div className="rounded-2xl border border-atres-border bg-atres-bg p-4">
            <h2 className="text-sm font-semibold text-atres-text">Descripcion</h2>
            <p className="mt-2 text-sm leading-7 text-atres-muted">
              {product.longDescription}
            </p>
          </div>

          <ProductDetailActions product={product} />
        </section>
      </div>

      <RelatedProducts products={relatedProducts} />
    </article>
  );
}
