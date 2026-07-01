"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil, Power } from "lucide-react";
import type { AdminProduct } from "@/types/admin-product";
import { formatPrice } from "@/lib/format";
import { ProductStatusBadge } from "@/components/admin/product-status-badge";
import { PrimaryButton } from "@/components/ui/primary-button";

type ProductAdminTableProps = {
  products: AdminProduct[];
  onDeactivate: (id: string) => void;
};

export function ProductAdminTable({
  products,
  onDeactivate,
}: ProductAdminTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-atres-border bg-atres-surface p-8 text-center text-sm text-atres-muted">
        No hay productos que coincidan con la busqueda.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-atres-border bg-atres-surface shadow-card">
      <div className="hidden md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-atres-border bg-atres-bg text-atres-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Producto</th>
              <th className="px-4 py-3 font-semibold">Taller</th>
              <th className="px-4 py-3 font-semibold">Categoria</th>
              <th className="px-4 py-3 font-semibold">Precio</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-atres-border/70">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="relative h-12 w-12 overflow-hidden rounded-xl bg-atres-bg">
                      <Image
                        src={product.imageUrls[0] ?? "/placeholders/textura-taller.svg"}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </span>
                    <span className="font-semibold text-atres-text">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-atres-muted">{product.workshopName}</td>
                <td className="px-4 py-3 text-atres-muted">{product.categoryName}</td>
                <td className="px-4 py-3 font-semibold text-atres-primary">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3 text-atres-muted">{product.stock}</td>
                <td className="px-4 py-3">
                  <ProductStatusBadge product={product} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={"/panel/productos/" + product.id + "/editar"}
                      className="inline-flex items-center gap-1 rounded-lg border border-atres-border px-3 py-1.5 text-xs font-semibold text-atres-text transition hover:border-atres-primary hover:text-atres-primary"
                    >
                      <Pencil size={14} />
                      Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDeactivate(product.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-atres-border px-3 py-1.5 text-xs font-semibold text-atres-muted transition hover:border-rose-300 hover:text-rose-700"
                    >
                      <Power size={14} />
                      Desactivar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {products.map((product) => (
          <article
            key={product.id}
            className="rounded-2xl border border-atres-border bg-atres-bg p-3"
          >
            <div className="flex gap-3">
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={product.imageUrls[0] ?? "/placeholders/textura-taller.svg"}
                  alt={product.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-atres-text">{product.name}</h3>
                <p className="mt-1 text-xs text-atres-muted">{product.workshopName}</p>
                <p className="text-xs text-atres-muted">{product.categoryName}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-atres-primary">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs text-atres-muted">Stock {product.stock}</span>
                  <ProductStatusBadge product={product} />
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                href={"/panel/productos/" + product.id + "/editar"}
                className="inline-flex min-h-9 items-center justify-center rounded-xl border border-atres-border bg-atres-surface px-4 text-xs font-semibold text-atres-text transition hover:border-atres-primary hover:text-atres-primary"
              >
                Editar
              </Link>
              <PrimaryButton
                tone="ghost"
                size="sm"
                className="w-full"
                onClick={() => onDeactivate(product.id)}
              >
                Desactivar
              </PrimaryButton>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
