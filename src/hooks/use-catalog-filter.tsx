"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CatalogFilterContextValue = {
  query: string;
  setQuery: (query: string) => void;
  activeCategory: string | null;
  setActiveCategory: (categoryId: string | null) => void;
};

const CatalogFilterContext = createContext<CatalogFilterContextValue | undefined>(
  undefined,
);

export function CatalogFilterProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      activeCategory,
      setActiveCategory,
    }),
    [activeCategory, query],
  );

  return (
    <CatalogFilterContext.Provider value={value}>
      {children}
    </CatalogFilterContext.Provider>
  );
}

export function useCatalogFilter() {
  const context = useContext(CatalogFilterContext);

  if (!context) {
    throw new Error("useCatalogFilter debe usarse dentro de CatalogFilterProvider");
  }

  return context;
}

export function useCatalogFilterOptional() {
  return useContext(CatalogFilterContext);
}
