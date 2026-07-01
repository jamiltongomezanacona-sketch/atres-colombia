import type { ReactNode } from "react";
import { CartProvider } from "@/hooks/use-cart";
import { CatalogFilterProvider } from "@/hooks/use-catalog-filter";
import { FavoritesProvider } from "@/hooks/use-favorites";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <FavoritesProvider>
        <CatalogFilterProvider>
          <div className="sticky top-0 z-40">
            <AnnouncementBar />
            <Header />
          </div>
          <main className="mx-auto min-h-screen max-w-7xl px-4 pb-24 pt-6 sm:px-6 md:pb-10 lg:pb-8">
            {children}
          </main>
          <BottomNav />
        </CatalogFilterProvider>
      </FavoritesProvider>
    </CartProvider>
  );
}
