"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Menu,
  Package,
  PlusCircle,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    href: "/panel",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/panel/productos",
    label: "Productos",
    icon: Package,
  },
  {
    href: "/panel/productos/nuevo",
    label: "Crear producto",
    icon: PlusCircle,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const content = (
    <div className="flex h-full flex-col">
      <div className="border-b border-atres-border px-5 py-5">
        <Link href="/panel" className="inline-flex items-center gap-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-xl bg-white shadow-sm">
            <Image
              src="/logo.png"
              alt="AtresColombia"
              fill
              sizes="40px"
              className="object-cover"
            />
          </span>
          <div>
            <p className="text-sm font-bold text-atres-text">Panel Atres</p>
            <p className="text-xs text-atres-muted">Gestion de productos</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active =
            item.href === "/panel"
              ? pathname === "/panel"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition duration-200 " +
                (active
                  ? "bg-atres-primary text-white"
                  : "text-atres-text hover:bg-atres-bg")
              }
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-atres-border p-4">
        <Link
          href="/"
          className="text-sm font-semibold text-atres-primary transition hover:underline"
        >
          Volver a la tienda
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        aria-label="Abrir menu del panel"
        onClick={() => setOpen(true)}
        className="inline-flex rounded-xl border border-atres-border bg-atres-surface p-2 text-atres-text lg:hidden"
      >
        <Menu size={20} />
      </button>

      <aside className="hidden w-72 shrink-0 rounded-2xl border border-atres-border bg-atres-surface shadow-card lg:block">
        {content}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[min(88vw,320px)] bg-atres-surface shadow-card">
            <button
              type="button"
              aria-label="Cerrar menu del panel"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full border border-atres-border p-2"
            >
              <X size={18} />
            </button>
            {content}
          </aside>
        </div>
      ) : null}
    </>
  );
}
