"use client";

import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProductForm } from "@/components/admin/product-form";
import { useAdminProducts } from "@/hooks/use-admin-products";

export function PanelProductCreateView() {
  const router = useRouter();
  const { createProduct, isReady } = useAdminProducts();

  if (!isReady) {
    return <p className="text-sm text-atres-muted">Cargando formulario...</p>;
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Crear producto"
        description="Registra una prenda nueva en el catalogo simulado del taller."
      />
      <ProductForm
        submitLabel="Guardar producto"
        onSubmit={(values) => {
          createProduct(values);
          router.push("/panel/productos?saved=1");
        }}
      />
    </div>
  );
}
