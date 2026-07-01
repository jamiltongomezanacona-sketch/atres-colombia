import { Suspense } from "react";
import { PanelProductsView } from "@/components/admin/panel-products-view";

export default function PanelProductsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-atres-muted">Cargando productos...</p>}>
      <PanelProductsView />
    </Suspense>
  );
}
