import type { Workshop } from "@/types/workshop";
import { WorkshopHeader } from "@/components/workshops/workshop-header";

type WorkshopProfileProps = {
  workshop: Workshop;
};

export function WorkshopProfile({ workshop }: WorkshopProfileProps) {
  return (
    <WorkshopHeader
      workshop={workshop}
      backHref="/talleres"
      backLabel="Volver a todos los talleres"
      showCatalogLink
    />
  );
}
