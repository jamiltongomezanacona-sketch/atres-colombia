import { WorkshopList } from "@/components/workshops/workshop-list";
import { getAllWorkshops } from "@/lib/repositories";

export default function WorkshopsPage() {
  const workshops = getAllWorkshops();

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
