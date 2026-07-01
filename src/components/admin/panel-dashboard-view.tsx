"use client";

import Link from "next/link";
import { Factory, Package, PackagePlus, PackageX, Store } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { DashboardCard } from "@/components/admin/dashboard-card";
import { useAdminProducts } from "@/hooks/use-admin-products";

const primaryLinkClass =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-atres-primary bg-atres-primary px-5 text-sm font-semibold text-white transition duration-200 hover:border-atres-primary-hover hover:bg-atres-primary-hover sm:w-auto";

const ghostLinkClass =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-atres-border bg-atres-surface px-5 text-sm font-semibold text-atres-text transition duration-200 hover:border-atres-primary hover:text-atres-primary sm:w-auto";

export function PanelDashboardView() {
  const { stats, isReady } = useAdminProducts();

  if (!isReady) {
    return <p className="text-sm text-atres-muted">Cargando panel...</p>;
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Dashboard"
        description="Resumen rapido de productos simulados por taller."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          label="Total de productos"
          value={stats.totalProducts}
          icon={<Package size={20} />}
        />
        <DashboardCard
          label="Productos activos"
          value={stats.activeProducts}
          icon={<PackagePlus size={20} />}
        />
        <DashboardCard
          label="Bajo pedido"
          value={stats.madeToOrderProducts}
          icon={<Factory size={20} />}
        />
        <DashboardCard
          label="Agotados"
          value={stats.outOfStockProducts}
          icon={<PackageX size={20} />}
        />
        <DashboardCard
          label="Talleres simulados"
          value={stats.totalWorkshops}
          icon={<Store size={20} />}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/panel/productos/nuevo" className={primaryLinkClass}>
          Crear producto
        </Link>
        <Link href="/panel/productos" className={ghostLinkClass}>
          Ver productos
        </Link>
      </div>
    </div>
  );
}
