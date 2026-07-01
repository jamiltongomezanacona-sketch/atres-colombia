import { notFound } from "next/navigation";
import { WorkshopCatalogView } from "@/components/workshops/workshop-catalog-view";
import {
  getProductsByWorkshopSlugAsync,
  getWorkshopBySlugAsync,
  getWorkshopSlugs,
} from "@/lib/repositories";

type WorkshopCatalogPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getWorkshopSlugs().map((slug) => ({ slug }));
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
