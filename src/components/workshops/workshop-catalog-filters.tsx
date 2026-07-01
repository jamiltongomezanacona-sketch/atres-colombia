"use client";

import type { Category } from "@/types/category";

type WorkshopCatalogFiltersProps = {
  categories: Category[];
  activeCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
};

export function WorkshopCatalogFilters({
  categories,
  activeCategoryId,
  onCategoryChange,
}: WorkshopCatalogFiltersProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => onCategoryChange(null)}
        className={
          "shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 " +
          (activeCategoryId === null
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
          onClick={() => onCategoryChange(category.id)}
          className={
            "shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 " +
            (activeCategoryId === category.id
              ? "border-atres-primary bg-atres-primary text-white"
              : "border-atres-border bg-atres-surface text-atres-text hover:border-atres-primary hover:text-atres-primary")
          }
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
