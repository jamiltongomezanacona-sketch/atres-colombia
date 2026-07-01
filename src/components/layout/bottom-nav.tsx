"use client";

import Link from "next/link";
import { Grid2X2, Heart, Home, ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

const navItems = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Categorias", href: "/#categorias", icon: Grid2X2 },
  { label: "Favoritos", href: "/#favoritos", icon: Heart },
  { label: "Carrito", href: "/carrito", icon: ShoppingBag },
  { label: "Perfil", href: "/nosotros", icon: UserRound },
];

export function BottomNav() {
  const { count } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-atres-border bg-atres-black/95 px-2 pb-2 pt-1 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const showCount = item.label === "Carrito" && count > 0;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-medium text-atres-muted transition hover:bg-white/5 hover:text-white"
            >
              <Icon size={19} />
              <span>{item.label}</span>
              {showCount ? (
                <span className="absolute right-4 top-1 min-w-5 rounded-full bg-atres-gold px-1 text-center text-xs font-bold text-atres-black">
                  {count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
