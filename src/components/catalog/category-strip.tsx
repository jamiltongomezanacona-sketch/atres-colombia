"use client";

import type { Category } from "@/types/category";
import { useCatalogFilter } from "@/hooks/use-catalog-filter";

type CategoryStripProps = {
  categories: Category[];
};

export function CategoryStrip({ categories }: CategoryStripProps) {
  const { activeCategory, setActiveCategory } = useCatalogFilter();

  const handleSelect = (categoryId: string | null) => {
    setActiveCategory(categoryId);

    if (categoryId) {
      document.getElementById(categoryId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    document.getElementById("catalogo")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="categorias"
      className="sticky top-[3.35rem] z-30 -mx-4 border-b border-atres-border/70 bg-atres-black/95 px-4 py-3 backdrop-blur md:top-[3.5rem]"
    >
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => handleSelect(null)}
          className={
            "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition " +
            (activeCategory === null
              ? "border-atres-green bg-atres-green text-atres-black"
              : "border-atres-border bg-atres-panel text-white hover:border-atres-green hover:text-atres-green")
          }
        >
          Todas
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => handleSelect(category.id)}
            className={
              "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition " +
              (activeCategory === category.id
                ? "border-atres-green bg-atres-green text-atres-black"
                : "border-atres-border bg-atres-panel text-white hover:border-atres-green hover:text-atres-green")
            }
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
}
