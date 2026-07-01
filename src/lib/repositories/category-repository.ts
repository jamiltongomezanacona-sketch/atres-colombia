import { categories } from "@/data/categories";
import type { Category } from "@/types/category";

/** Punto unico de lectura de categorias (futuro: Supabase). */
export function getAllCategories(): Category[] {
  return categories;
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((category) => category.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
