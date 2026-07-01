import { notFound } from "next/navigation";
import { WorkshopHeader } from "@/components/workshops/workshop-header";
import { WorkshopCatalog } from "@/components/workshops/workshop-catalog";
import { getProductsByWorkshopSlug } from "@/data/products";
import { getWorkshopBySlug, workshops } from "@/data/workshops";

type WorkshopPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return workshops.map((workshop) => ({ slug: workshop.slug }));
}

export default async function WorkshopPage({ params }: WorkshopPageProps) {
  const { slug } = await params;
  const workshop = getWorkshopBySlug(slug);

  if (!workshop) {
    notFound();
  }

  const products = getProductsByWorkshopSlug(slug);

  return (
    <div className="space-y-8 sm:space-y-10">
      <WorkshopHeader workshop={workshop} />
      <WorkshopCatalog workshop={workshop} products={products} />
    </div>
  );
}
