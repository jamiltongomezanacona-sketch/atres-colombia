"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProductForm } from "@/components/admin/product-form";
import { useAdminProducts } from "@/hooks/use-admin-products";

type PanelProductEditViewProps = {
  productId: string;
};

export function PanelProductEditView({ productId }: PanelProductEditViewProps) {
  const router = useRouter();
  const { getProductById, updateProduct, isReady } = useAdminProducts();
  const product = getProductById(productId);

  if (!isReady) {
    return <p className="text-sm text-atres-muted">Cargando producto...</p>;
  }

  if (!product) {
    return (
      <div className="space-y-4 rounded-2xl border border-atres-border bg-atres-surface p-6">
        <h1 className="text-xl font-bold text-atres-text">Producto no encontrado</h1>
        <Link href="/panel/productos" className="text-sm font-semibold text-atres-primary">
          Volver a productos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title={"Editar: " + product.name}
        description="Actualiza la informacion simulada del producto."
      />
      <ProductForm
        initialProduct={product}
        submitLabel="Guardar cambios"
        onSubmit={(values) => {
          updateProduct(productId, values);
          router.push("/panel/productos?saved=1");
        }}
      />
    </div>
  );
}
