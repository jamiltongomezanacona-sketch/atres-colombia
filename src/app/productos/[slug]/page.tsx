import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductDetailActions } from "@/components/products/product-detail-actions";
import { formatPrice } from "@/lib/format";
import { getProductBySlug, products } from "@/data/products";

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

  return (
    <article className="space-y-5">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-atres-muted transition hover:text-white"
      >
        <ArrowLeft size={18} />
        Volver al catalogo
      </Link>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
        <ProductGallery name={product.name} images={product.images} />
        <section className="space-y-5 rounded-lg border border-atres-border bg-atres-panel/80 p-4 lg:p-6">
          <div>
            <p className="text-sm font-semibold text-atres-gold">{product.category}</p>
            <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-sm leading-6 text-atres-muted">
              {product.longDescription}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xl font-bold text-atres-green">
              {formatPrice(product.price)}
            </span>
            {product.previousPrice ? (
              <span className="text-atres-muted line-through">
                {formatPrice(product.previousPrice)}
              </span>
            ) : null}
            {product.discount ? (
              <span className="rounded-full border border-atres-gold px-3 py-1 text-sm font-semibold text-atres-gold">
                Ahorra {product.discount}
              </span>
            ) : null}
          </div>
          <ProductDetailActions product={product} />
        </section>
      </div>
    </article>
  );
}
