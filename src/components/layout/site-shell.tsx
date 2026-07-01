import type { ReactNode } from "react";
import { CartProvider } from "@/hooks/use-cart";
import { CatalogFilterProvider } from "@/hooks/use-catalog-filter";
import { FavoritesProvider } from "@/hooks/use-favorites";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <FavoritesProvider>
        <CatalogFilterProvider>
          <Header />
          <main className="mx-auto min-h-screen max-w-6xl px-4 pb-24 pt-4 md:px-6 md:pb-10 md:pt-5">
            {children}
          </main>
          <BottomNav />
        </CatalogFilterProvider>
      </FavoritesProvider>
    </CartProvider>
  );
}
