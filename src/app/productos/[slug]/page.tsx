import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/products/product-detail-view";
import {
  getProductBySlugAsync,
  getProductSlugsAsync,
  getSameWorkshopProductsAsync,
  getSuggestedProductsAsync,
  getWorkshopBySlugAsync,
} from "@/lib/repositories";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getProductSlugsAsync();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlugAsync(slug);

  if (!product) {
    notFound();
  }

  const workshop = await getWorkshopBySlugAsync(product.workshopSlug);

  if (!workshop) {
    notFound();
  }

  const [sameWorkshopProducts, suggestedProducts] = await Promise.all([
    getSameWorkshopProductsAsync(slug),
    getSuggestedProductsAsync(slug),
  ]);

  return (
    <ProductDetailView
      product={product}
      workshop={workshop}
      sameWorkshopProducts={sameWorkshopProducts}
      suggestedProducts={suggestedProducts}
    />
  );
}
