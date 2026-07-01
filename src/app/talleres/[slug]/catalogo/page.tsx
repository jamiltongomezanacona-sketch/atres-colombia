import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { WorkshopCatalog } from "@/components/workshops/workshop-catalog";
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

  return (
    <div className="space-y-6 sm:space-y-8">
      <Link
        href={"/talleres/" + slug}
        className="inline-flex items-center gap-2 text-sm font-semibold text-atres-muted transition duration-200 hover:text-atres-primary"
      >
        <ArrowLeft size={18} />
        Perfil de {workshop.name}
      </Link>
      <WorkshopCatalog workshop={workshop} products={products} />
    </div>
  );
}
