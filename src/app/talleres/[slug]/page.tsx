import { notFound } from "next/navigation";
import { WorkshopProfile } from "@/components/workshops/workshop-profile";
import {
  getWorkshopBySlugAsync,
  getWorkshopSlugsAsync,
} from "@/lib/repositories";

type WorkshopPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getWorkshopSlugsAsync();
  return slugs.map((slug) => ({ slug }));
}

export default async function WorkshopPage({ params }: WorkshopPageProps) {
  const { slug } = await params;
  const workshop = await getWorkshopBySlugAsync(slug);

  if (!workshop) {
    notFound();
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <WorkshopProfile workshop={workshop} />
    </div>
  );
}
