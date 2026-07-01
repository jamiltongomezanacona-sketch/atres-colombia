"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useCatalogFilterOptional } from "@/hooks/use-catalog-filter";
import { useFavorites } from "@/hooks/use-favorites";
import { MobileMenu } from "@/components/layout/mobile-menu";

function Badge({ count }: { count: number }) {
  if (count <= 0) {
    return null;
  }

  return (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-atres-gold px-1 text-[10px] font-bold text-white">
      {count}
    </span>
  );
}

export function Header() {
  const { count } = useCart();
  const { count: favoritesCount } = useFavorites();
  const catalogFilter = useCatalogFilterOptional();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

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
    <>
      <header className="border-b border-atres-border bg-atres-surface shadow-header">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          {/* Mobile layout */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              aria-label="Abrir menu"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-atres-text transition hover:bg-atres-bg hover:text-atres-primary"
            >
              <Menu size={22} />
            </button>
            <Link
              href="/"
              className="min-w-0 flex-1 truncate text-lg font-bold text-atres-primary"
            >
              AtresColombia
            </Link>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Favoritos"
                onClick={scrollToFavorites}
                className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-atres-text transition hover:bg-atres-bg hover:text-atres-primary"
              >
                <Heart size={20} />
                <Badge count={favoritesCount} />
              </button>
              <Link
                href="/carrito"
                aria-label="Carrito"
                className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-atres-text transition hover:bg-atres-bg hover:text-atres-primary"
              >
                <ShoppingBag size={20} />
                <Badge count={count} />
              </Link>
              <Link
                href="/nosotros"
                aria-label="Perfil"
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-atres-text transition hover:bg-atres-bg hover:text-atres-primary"
              >
                <UserRound size={20} />
              </Link>
            </div>
          </div>

          {/* Mobile search */}
          <div className="mt-3 lg:hidden">
            <div className="flex items-center gap-2 rounded-xl border border-atres-border bg-atres-bg px-3 py-2.5">
              <Search size={18} className="shrink-0 text-atres-muted" />
              <input
                aria-label="Buscar productos"
                placeholder="Buscar prendas, categorias..."
                value={catalogFilter?.query ?? ""}
                onChange={(event) => catalogFilter?.setQuery(event.target.value)}
                disabled={!catalogFilter}
                className="w-full bg-transparent text-sm text-atres-text outline-none placeholder:text-atres-muted disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden items-center gap-6 lg:flex">
            <Link
              href="/"
              className="shrink-0 text-xl font-bold tracking-tight text-atres-primary"
            >
              AtresColombia
            </Link>
            <div className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-xl border border-atres-border bg-atres-bg px-4 py-3">
              <Search size={18} className="shrink-0 text-atres-muted" />
              <input
                aria-label="Buscar productos"
                placeholder="Buscar prendas, categorias, colores..."
                value={catalogFilter?.query ?? ""}
                onChange={(event) => catalogFilter?.setQuery(event.target.value)}
                disabled={!catalogFilter}
                className="w-full bg-transparent text-sm text-atres-text outline-none placeholder:text-atres-muted disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                aria-label="Favoritos"
                onClick={scrollToFavorites}
                className="relative inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-atres-text transition hover:bg-atres-bg hover:text-atres-primary"
              >
                <Heart size={20} />
                <Badge count={favoritesCount} />
              </button>
              <Link
                href="/carrito"
                aria-label="Carrito"
                className="relative inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-atres-text transition hover:bg-atres-bg hover:text-atres-primary"
              >
                <ShoppingBag size={20} />
                <Badge count={count} />
              </Link>
              <Link
                href="/nosotros"
                aria-label="Perfil"
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-atres-text transition hover:bg-atres-bg hover:text-atres-primary"
              >
                <UserRound size={20} />
              </Link>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
