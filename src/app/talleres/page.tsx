import { WorkshopList } from "@/components/workshops/workshop-list";
import { getAllWorkshopsAsync } from "@/lib/repositories";

export default async function WorkshopsPage() {
  const workshops = await getAllWorkshopsAsync();

  return (
    <div className="space-y-6">
      <WorkshopList
        workshops={workshops}
        title="Todos los talleres y tiendas"
        description="Explora puntos de confeccion verificados en Colombia. Cada uno tiene su propio catalogo y atencion directa."
      />
    </div>
  );
}
