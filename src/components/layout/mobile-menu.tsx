"use client";

import Link from "next/link";
import { X } from "lucide-react";
import type { Category } from "@/types/category";
import { categories } from "@/data/categories";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

const menuLinks = [
  { label: "Inicio", href: "/" },
  { label: "Carrito", href: "/carrito" },
  { label: "Perfil", href: "/nosotros" },
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) {
    return null;
  }

  const handleCategoryClick = (category: Category) => {
    onClose();
    window.location.href = category.href;
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Cerrar menu"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="absolute left-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-atres-surface shadow-soft animate-slide-up">
        <div className="flex items-center justify-between border-b border-atres-border px-4 py-4">
          <span className="text-lg font-bold text-atres-primary">AtresColombia</span>
          <button
            type="button"
            aria-label="Cerrar menu"
            onClick={onClose}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-atres-text transition hover:bg-atres-bg"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-atres-muted">
            Categorias
          </p>
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className="w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-medium text-atres-text transition hover:bg-atres-bg hover:text-atres-primary"
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
          <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-atres-muted">
            Menu
          </p>
          <ul className="space-y-1">
            {menuLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-atres-text transition hover:bg-atres-bg hover:text-atres-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
