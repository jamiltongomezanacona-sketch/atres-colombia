import { notFound } from "next/navigation";
import { WorkshopProfile } from "@/components/workshops/workshop-profile";
import {
  getWorkshopBySlug,
  getWorkshopSlugs,
} from "@/lib/repositories";

type WorkshopPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getWorkshopSlugs().map((slug) => ({ slug }));
}

export default async function WorkshopPage({ params }: WorkshopPageProps) {
  const { slug } = await params;
  const workshop = getWorkshopBySlug(slug);

  if (!workshop) {
    notFound();
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <WorkshopProfile workshop={workshop} />
    </div>
  );
}
