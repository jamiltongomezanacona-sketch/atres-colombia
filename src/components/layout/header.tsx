"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useCatalogFilterOptional } from "@/hooks/use-catalog-filter";
import { useFavorites } from "@/hooks/use-favorites";
import { IconButton } from "@/components/ui/icon-button";

export function Header() {
  const { count } = useCart();
  const { count: favoritesCount } = useFavorites();
  const catalogFilter = useCatalogFilterOptional();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const scrollToFavorites = () => {
    if (isHome) {
      document.getElementById("favoritos")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    window.location.href = "/#favoritos";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-atres-border/80 bg-atres-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
        <IconButton label="Abrir menu">
          <Menu size={20} />
        </IconButton>
        <Link
          href="/"
          className="min-w-0 flex-1 truncate text-base font-bold tracking-normal text-white sm:text-lg"
        >
          AtresColombia
        </Link>
        <div className="hidden min-w-56 flex-1 items-center gap-2 rounded-full border border-atres-border bg-white/5 px-3 py-2 text-atres-muted sm:flex md:min-w-64">
          <Search size={17} />
          <input
            aria-label="Buscar productos"
            placeholder="Buscar prendas"
            value={catalogFilter?.query ?? ""}
            onChange={(event) => catalogFilter?.setQuery(event.target.value)}
            disabled={!catalogFilter}
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-atres-muted disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
        <IconButton
          label={mobileSearchOpen ? "Cerrar busqueda" : "Buscar"}
          className="sm:hidden"
          onClick={() => setMobileSearchOpen((current) => !current)}
        >
          {mobileSearchOpen ? <X size={19} /> : <Search size={19} />}
        </IconButton>
        <IconButton
          label="Favoritos"
          onClick={scrollToFavorites}
          className="relative"
        >
          <Heart size={19} />
          {favoritesCount > 0 ? (
            <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-atres-gold px-1 text-center text-[10px] font-bold text-atres-black">
              {favoritesCount}
            </span>
          ) : null}
        </IconButton>
        <Link
          href="/carrito"
          aria-label="Carrito"
          title="Carrito"
          className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-atres-border bg-white/5 text-white transition hover:border-atres-green hover:text-atres-green"
        >
          <ShoppingBag size={19} />
          {count > 0 ? (
            <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-atres-gold px-1 text-center text-[10px] font-bold text-atres-black">
              {count}
            </span>
          ) : null}
        </Link>
      </div>
      {mobileSearchOpen ? (
        <div className="border-t border-atres-border/70 px-3 pb-3 pt-2 sm:hidden">
          <div className="flex items-center gap-2 rounded-full border border-atres-border bg-white/5 px-3 py-2">
            <Search size={17} className="text-atres-muted" />
            <input
              aria-label="Buscar productos"
              placeholder="Buscar prendas"
              value={catalogFilter?.query ?? ""}
              onChange={(event) => catalogFilter?.setQuery(event.target.value)}
              disabled={!catalogFilter}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-atres-muted disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}
