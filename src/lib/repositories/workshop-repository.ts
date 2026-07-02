import { workshopRecords } from "@/data/workshops";
import type { Workshop, WorkshopRecord } from "@/types/workshop";
import {
  countProductsByWorkshopId,
  getAllProducts,
  getAllProductsAsync,
} from "@/lib/repositories/product-repository";
import { filterProducts } from "@/lib/catalog";
import type { Product } from "@/types/product";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchWorkshopsFromSupabase } from "@/lib/supabase/fetch-workshops";

let seedCache: Workshop[] | null = null;
let asyncCache: Workshop[] | null = null;
let asyncLoadPromise: Promise<Workshop[]> | null = null;

function enrichWorkshop(record: WorkshopRecord, products?: Product[]): Workshop {
  const workshopProducts = products
    ? products.filter((product) => product.workshopSlug === record.slug)
    : [];

  const categories =
    workshopProducts.length > 0
      ? [...new Set(workshopProducts.map((product) => product.categoryId))]
      : record.categories;

  const specialties =
    workshopProducts.length > 0
      ? [...new Set(workshopProducts.map((product) => product.categoryName))]
      : record.specialties;

  const productCount = products
    ? workshopProducts.length
    : countProductsByWorkshopId(record.id);

  return {
    ...record,
    categories,
    specialties,
    productCount,
  };
}

function loadWorkshopsFromSeeds(products?: Product[]): Workshop[] {
  if (!seedCache || products) {
    seedCache = workshopRecords
      .filter((record) => record.status === "active")
      .map((record) => enrichWorkshop(record, products));
  }

  return seedCache;
}

async function loadWorkshopsAsync(): Promise<Workshop[]> {
  const products = await getAllProductsAsync();

  if (!isSupabaseConfigured()) {
    console.log("Usando datos locales");
    return loadWorkshopsFromSeeds(products);
  }

  try {
    const records = await fetchWorkshopsFromSupabase();

    if (records.length > 0) {
      console.log("Leyendo datos desde Supabase");
      return records.map((record) => enrichWorkshop(record, products));
    }
  } catch (error) {
    console.warn("[AtresColombia] Supabase workshops fallback to seeds.", error);
  }

  console.log("Usando datos locales");
  return loadWorkshopsFromSeeds(products);
}

function getWorkshopSource(products?: Product[]): Workshop[] {
  if (asyncCache) {
    return asyncCache;
  }

  console.log("Usando datos locales");
  return loadWorkshopsFromSeeds(products);
}

/** Punto unico de lectura de talleres desde Supabase con fallback a seeds. */
export async function getAllWorkshopsAsync(): Promise<Workshop[]> {
  if (asyncCache) {
    return asyncCache;
  }

  if (!asyncLoadPromise) {
    asyncLoadPromise = loadWorkshopsAsync().then((workshops) => {
      asyncCache = workshops;
      return workshops;
    });
  }

  return asyncLoadPromise;
}

export function getAllWorkshops(): Workshop[] {
  return getWorkshopSource();
}

export function getWorkshopBySlug(slug: string): Workshop | undefined {
  const workshops = getWorkshopSource();
  return workshops.find(
    (workshop) => workshop.slug === slug && workshop.status === "active",
  );
}

export async function getWorkshopBySlugAsync(slug: string): Promise<Workshop | undefined> {
  const workshops = await getAllWorkshopsAsync();
  return workshops.find(
    (workshop) => workshop.slug === slug && workshop.status === "active",
  );
}

export function getWorkshopById(id: string): Workshop | undefined {
  const workshops = getWorkshopSource();
  return workshops.find(
    (workshop) => workshop.id === id && workshop.status === "active",
  );
}

export function getWorkshopSlugs(): string[] {
  return getWorkshopSource().map((workshop) => workshop.slug);
}

export async function getWorkshopSlugsAsync(): Promise<string[]> {
  const workshops = await getAllWorkshopsAsync();
  return workshops.map((workshop) => workshop.slug);
}

export function filterWorkshops(workshops: Workshop[], query: string): Workshop[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return workshops;
  }

  const matchingProductWorkshopIds = new Set(
    filterProducts(getAllProducts(), query).map((product) => product.workshopId),
  );

  return workshops.filter((workshop) => {
    const searchableText = [
      workshop.name,
      workshop.location,
      workshop.city,
      workshop.department,
      workshop.description,
      ...workshop.specialties,
      ...workshop.deliveryCities,
    ]
      .join(" ")
      .toLowerCase();

    return (
      searchableText.includes(normalizedQuery) ||
      matchingProductWorkshopIds.has(workshop.id)
    );
  });
}
