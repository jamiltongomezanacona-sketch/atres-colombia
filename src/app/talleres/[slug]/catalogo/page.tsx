import { notFound } from "next/navigation";
import { WorkshopCatalogView } from "@/components/workshops/workshop-catalog-view";
import {
  getProductsByWorkshopSlugAsync,
  getWorkshopBySlugAsync,
  getWorkshopSlugsAsync,
} from "@/lib/repositories";

type WorkshopCatalogPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getWorkshopSlugsAsync();
  return slugs.map((slug) => ({ slug }));
}

export default async function WorkshopCatalogPage({
  params,
}: WorkshopCatalogPageProps) {
  const { slug } = await params;
  const workshop = await getWorkshopBySlugAsync(slug);

  if (!workshop) {
    notFound();
  }

  const products = await getProductsByWorkshopSlugAsync(slug);

  return <WorkshopCatalogView workshop={workshop} products={products} />;
}
