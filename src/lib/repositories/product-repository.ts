import { productSeeds } from "@/data/products";
import { normalizeProducts } from "@/lib/products/normalize";
import type { Product } from "@/types/product";

let cachedProducts: Product[] | null = null;

function loadProducts(): Product[] {
  if (!cachedProducts) {
    cachedProducts = normalizeProducts(productSeeds);
  }

  return cachedProducts;
}

/** Punto unico de lectura de productos (futuro: Supabase). */
export function getAllProducts(): Product[] {
  return loadProducts();
}

export function getProductBySlug(slug: string): Product | undefined {
  return loadProducts().find((product) => product.slug === slug);
}

export function getProductsByWorkshopSlug(workshopSlug: string): Product[] {
  return loadProducts().filter((product) => product.workshopSlug === workshopSlug);
}

export function getProductsByWorkshopId(workshopId: string): Product[] {
  return loadProducts().filter((product) => product.workshopId === workshopId);
}

export function countProductsByWorkshopId(workshopId: string): number {
  return getProductsByWorkshopId(workshopId).length;
}

export function getProductSlugs(): string[] {
  return loadProducts().map((product) => product.slug);
}

export function getSameWorkshopProducts(slug: string, limit = 4): Product[] {
  const product = getProductBySlug(slug);

  if (!product) {
    return [];
  }

  return getProductsByWorkshopSlug(product.workshopSlug)
    .filter((item) => item.slug !== slug)
    .slice(0, limit);
}

export function getSuggestedProducts(slug: string, limit = 4): Product[] {
  const product = getProductBySlug(slug);

  if (!product) {
    return [];
  }

  return loadProducts()
    .filter(
      (item) =>
        item.slug !== slug &&
        item.workshopSlug !== product.workshopSlug &&
        item.categoryId === product.categoryId,
    )
    .slice(0, limit);
}

export function getRelatedProducts(slug: string, limit = 3): Product[] {
  const product = getProductBySlug(slug);

  if (!product) {
    return [];
  }

  const sameWorkshop = getProductsByWorkshopSlug(product.workshopSlug).filter(
    (item) => item.slug !== slug,
  );

  if (sameWorkshop.length >= limit) {
    return sameWorkshop.slice(0, limit);
  }

  const sameCategory = loadProducts().filter(
    (item) =>
      item.categoryId === product.categoryId &&
      item.slug !== slug &&
      item.workshopSlug !== product.workshopSlug,
  );

  return [...sameWorkshop, ...sameCategory].slice(0, limit);
}
