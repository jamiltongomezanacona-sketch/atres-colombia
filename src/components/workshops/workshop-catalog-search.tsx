"use client";

import { Search } from "lucide-react";

type WorkshopCatalogSearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
};

export function WorkshopCatalogSearch({
  query,
  onQueryChange,
  placeholder = "Buscar en este catalogo...",
}: WorkshopCatalogSearchProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-atres-border bg-atres-surface px-3 py-2.5 shadow-sm">
      <Search size={18} className="shrink-0 text-atres-muted" />
      <input
        aria-label="Buscar productos del taller"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-atres-text outline-none placeholder:text-atres-muted"
      />
    </div>
  );
}
