import { notFound } from "next/navigation";
import { WorkshopCatalogView } from "@/components/workshops/workshop-catalog-view";
import {
  getProductsByWorkshopSlug,
  getWorkshopBySlug,
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
  const workshop = getWorkshopBySlug(slug);

  if (!workshop) {
    notFound();
  }

  const products = getProductsByWorkshopSlug(slug);

  return <WorkshopCatalogView workshop={workshop} products={products} />;
}
