import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export function getCategoryId(categoryName: string) {
  return categoryName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function groupProductsByCategory(
  products: Product[],
  categories: Category[],
) {
  return categories
    .map((category) => ({
      category,
      products: products.filter(
        (product) => getCategoryId(product.category) === category.id,
      ),
    }))
    .filter((section) => section.products.length > 0);
}

export function filterProducts(products: Product[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return products;
  }

  return products.filter((product) => {
    const searchableText = [
      product.name,
      product.description,
      product.category,
      ...product.colors.map((color) => color.name),
      ...product.sizes,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}
