import type { ReactNode } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminProductsProvider } from "@/hooks/use-admin-products";

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProductsProvider>
      <AdminLayout>{children}</AdminLayout>
    </AdminProductsProvider>
  );
}
