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
    <section id="categorias" className="scroll-mt-36 space-y-3">
      <h2 className="text-lg font-bold text-atres-text sm:text-xl">
        Explora por categoria
      </h2>
      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => handleSelect(null)}
          className={
            "shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-semibold transition duration-200 " +
            (activeCategory === null
              ? "border-atres-primary bg-atres-primary text-white"
              : "border-atres-border bg-atres-surface text-atres-text hover:border-atres-primary hover:text-atres-primary")
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
              "shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-semibold transition duration-200 " +
              (activeCategory === category.id
                ? "border-atres-primary bg-atres-primary text-white"
                : "border-atres-border bg-atres-surface text-atres-text hover:border-atres-primary hover:text-atres-primary")
            }
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
}
