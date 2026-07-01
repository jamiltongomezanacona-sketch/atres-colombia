import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { getAllCategories } from "@/lib/repositories/category-repository";

export function getCategoriesForProducts(products: Product[]): Category[] {
  const categoryIds = new Set(products.map((product) => product.categoryId));

  return getAllCategories().filter((category) => categoryIds.has(category.id));
}

export function filterProductsByCategory(
  products: Product[],
  categoryId: string | null,
): Product[] {
  if (!categoryId) {
    return products;
  }

  return products.filter((product) => product.categoryId === categoryId);
}
