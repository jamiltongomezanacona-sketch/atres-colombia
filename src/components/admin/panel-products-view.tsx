"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { categories } from "@/data/categories";
import { filterAdminProducts } from "@/lib/admin/helpers";
import { getAllWorkshops } from "@/lib/repositories";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProductAdminTable } from "@/components/admin/product-admin-table";
import { useAdminProducts } from "@/hooks/use-admin-products";

const primaryLinkClass =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-atres-primary bg-atres-primary px-5 text-sm font-semibold text-white transition duration-200 hover:border-atres-primary-hover hover:bg-atres-primary-hover sm:w-auto";

export function PanelProductsView() {
  const { products, deactivateProduct, isReady } = useAdminProducts();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [workshopId, setWorkshopId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const workshops = useMemo(() => getAllWorkshops(), []);
  const saved = searchParams.get("saved");

  const filteredProducts = useMemo(
    () => filterAdminProducts(products, { query, workshopId, categoryId }),
    [categoryId, products, query, workshopId],
  );

  if (!isReady) {
    return <p className="text-sm text-atres-muted">Cargando productos...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <AdminHeader
          title="Productos"
          description="Gestiona el catalogo simulado de cada taller."
        />
        <Link href="/panel/productos/nuevo" className={primaryLinkClass}>
          Crear producto
        </Link>
      </div>

      {saved ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          Producto guardado correctamente.
        </p>
      ) : null}

      <div className="grid gap-3 rounded-2xl border border-atres-border bg-atres-surface p-4 sm:grid-cols-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar producto..."
          className="rounded-xl border border-atres-border bg-atres-bg px-3 py-2.5 text-sm sm:col-span-1"
        />
        <select
          value={workshopId}
          onChange={(event) => setWorkshopId(event.target.value)}
          className="rounded-xl border border-atres-border bg-atres-bg px-3 py-2.5 text-sm"
        >
          <option value="">Todos los talleres</option>
          {workshops.map((workshop) => (
            <option key={workshop.id} value={workshop.id}>
              {workshop.name}
            </option>
          ))}
        </select>
        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="rounded-xl border border-atres-border bg-atres-bg px-3 py-2.5 text-sm"
        >
          <option value="">Todas las categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <ProductAdminTable
        products={filteredProducts}
        onDeactivate={deactivateProduct}
      />
    </div>
  );
}
