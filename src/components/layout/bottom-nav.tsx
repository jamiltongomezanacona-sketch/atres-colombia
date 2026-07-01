"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid2X2, Heart, Home, ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

const navItems = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Talleres", href: "/talleres", icon: Grid2X2 },
  { label: "Favoritos", href: "/#favoritos", icon: Heart },
  { label: "Carrito", href: "/carrito", icon: ShoppingBag },
  { label: "Perfil", href: "/nosotros", icon: UserRound },
];

export function BottomNav() {
  const { count } = useCart();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-atres-border bg-atres-surface/95 px-2 pb-2 pt-1 shadow-header backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/" ? pathname === "/" : pathname === item.href;
          const showCount = item.label === "Carrito" && count > 0;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={
                "relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-medium transition duration-200 " +
                (isActive
                  ? "text-atres-primary"
                  : "text-atres-muted hover:text-atres-primary")
              }
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
              {showCount ? (
                <span className="absolute right-3 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-atres-gold px-1 text-[10px] font-bold text-white">
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
