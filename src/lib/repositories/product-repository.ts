import { productSeeds } from "@/data/products";
import { normalizeProducts } from "@/lib/products/normalize";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchProductsFromSupabase } from "@/lib/supabase/fetch-products";
import type { Product } from "@/types/product";

let seedCache: Product[] | null = null;
let asyncCache: Product[] | null = null;
let asyncLoadPromise: Promise<Product[]> | null = null;

function loadProductsFromSeeds(): Product[] {
  if (!seedCache) {
    seedCache = normalizeProducts(productSeeds);
  }

  return seedCache;
}

function getProductSource(): Product[] {
  if (asyncCache) {
    return asyncCache;
  }

  console.log("Usando datos locales");
  return loadProductsFromSeeds();
}

async function loadProductsAsync(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    console.log("Usando datos locales");
    return loadProductsFromSeeds();
  }

  try {
    const products = await fetchProductsFromSupabase();

    if (products.length > 0) {
      console.log("Leyendo datos desde Supabase");
      return products;
    }
  } catch (error) {
    console.warn("[AtresColombia] Supabase products fallback to seeds.", error);
  }

  console.log("Usando datos locales");
  return loadProductsFromSeeds();
}

/** Resuelve productos desde Supabase con fallback a seeds (server / build). */
export async function getAllProductsAsync(): Promise<Product[]> {
  if (asyncCache) {
    return asyncCache;
  }

  if (!asyncLoadPromise) {
    asyncLoadPromise = loadProductsAsync().then((products) => {
      asyncCache = products;
      return products;
    });
  }

  return asyncLoadPromise;
}

/** Lectura sincrona usando cache de Supabase o fallback a seeds. */
export function getAllProducts(): Product[] {
  return getProductSource();
}

export async function getProductBySlugAsync(
  slug: string,
): Promise<Product | undefined> {
  const products = await getAllProductsAsync();
  return products.find((product) => product.slug === slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProductSource().find((product) => product.slug === slug);
}

export async function getProductsByWorkshopSlugAsync(
  workshopSlug: string,
): Promise<Product[]> {
  const products = await getAllProductsAsync();
  return products.filter((product) => product.workshopSlug === workshopSlug);
}

export function getProductsByWorkshopSlug(workshopSlug: string): Product[] {
  return getProductSource().filter(
    (product) => product.workshopSlug === workshopSlug,
  );
}

export function getProductsByWorkshopId(workshopId: string): Product[] {
  return getProductSource().filter(
    (product) => product.workshopId === workshopId,
  );
}

export async function countProductsByWorkshopSlugAsync(
  workshopSlug: string,
): Promise<number> {
  const products = await getProductsByWorkshopSlugAsync(workshopSlug);
  return products.length;
}

export function countProductsByWorkshopId(workshopId: string): number {
  return getProductsByWorkshopId(workshopId).length;
}

export async function getProductSlugsAsync(): Promise<string[]> {
  const products = await getAllProductsAsync();
  return products.map((product) => product.slug);
}

export function getProductSlugs(): string[] {
  return getProductSource().map((product) => product.slug);
}

export async function getSameWorkshopProductsAsync(
  slug: string,
  limit = 4,
): Promise<Product[]> {
  const product = await getProductBySlugAsync(slug);

  if (!product) {
    return [];
  }

  const products = await getProductsByWorkshopSlugAsync(product.workshopSlug);
  return products.filter((item) => item.slug !== slug).slice(0, limit);
}

export async function getSuggestedProductsAsync(
  slug: string,
  limit = 4,
): Promise<Product[]> {
  const product = await getProductBySlugAsync(slug);

  if (!product) {
    return [];
  }

  const products = await getAllProductsAsync();
  return products
    .filter(
      (item) =>
        item.slug !== slug &&
        item.workshopSlug !== product.workshopSlug &&
        item.categoryId === product.categoryId,
    )
    .slice(0, limit);
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

  return getProductSource()
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

  const sameCategory = getProductSource().filter(
    (item) =>
      item.categoryId === product.categoryId &&
      item.slug !== slug &&
      item.workshopSlug !== product.workshopSlug,
  );

  return [...sameWorkshop, ...sameCategory].slice(0, limit);
}

export async function getRelatedProductsAsync(
  slug: string,
  limit = 3,
): Promise<Product[]> {
  const product = await getProductBySlugAsync(slug);

  if (!product) {
    return [];
  }

  const sameWorkshop = (await getProductsByWorkshopSlugAsync(product.workshopSlug))
    .filter((item) => item.slug !== slug);

  if (sameWorkshop.length >= limit) {
    return sameWorkshop.slice(0, limit);
  }

  const products = await getAllProductsAsync();
  const sameCategory = products.filter(
    (item) =>
      item.categoryId === product.categoryId &&
      item.slug !== slug &&
      item.workshopSlug !== product.workshopSlug,
  );

  return [...sameWorkshop, ...sameCategory].slice(0, limit);
}
