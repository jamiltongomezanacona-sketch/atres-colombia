import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/products/product-detail-view";
import {
  getProductBySlug,
  getProductSlugs,
  getSameWorkshopProducts,
  getSuggestedProducts,
  getWorkshopBySlug,
} from "@/lib/repositories";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const workshop = getWorkshopBySlug(product.workshopSlug);

  if (!workshop) {
    notFound();
  }

  const sameWorkshopProducts = getSameWorkshopProducts(slug);
  const suggestedProducts = getSuggestedProducts(slug);

  return (
    <ProductDetailView
      product={product}
      workshop={workshop}
      sameWorkshopProducts={sameWorkshopProducts}
      suggestedProducts={suggestedProducts}
    />
  );
}
