import { workshopRecords } from "@/data/workshops";
import type { Workshop, WorkshopRecord } from "@/types/workshop";
import {
  countProductsByWorkshopId,
  getAllProducts,
  getAllProductsAsync,
} from "@/lib/repositories/product-repository";
import { filterProducts } from "@/lib/catalog";
import type { Product } from "@/types/product";

function enrichWorkshop(record: WorkshopRecord, products?: Product[]): Workshop {
  const productCount = products
    ? products.filter((product) => product.workshopSlug === record.slug).length
    : countProductsByWorkshopId(record.id);

  return {
    ...record,
    productCount,
  };
}

/** Punto unico de lectura de talleres (futuro: Supabase). */
export async function getAllWorkshopsAsync(): Promise<Workshop[]> {
  const products = await getAllProductsAsync();

  return workshopRecords
    .filter((record) => record.status === "active")
    .map((record) => enrichWorkshop(record, products));
}

export function getAllWorkshops(): Workshop[] {
  return workshopRecords
    .filter((record) => record.status === "active")
    .map((record) => enrichWorkshop(record));
}

export function getWorkshopBySlug(slug: string): Workshop | undefined {
  const record = workshopRecords.find(
    (workshop) => workshop.slug === slug && workshop.status === "active",
  );

  return record ? enrichWorkshop(record) : undefined;
}

export async function getWorkshopBySlugAsync(slug: string): Promise<Workshop | undefined> {
  const record = workshopRecords.find(
    (workshop) => workshop.slug === slug && workshop.status === "active",
  );

  if (!record) {
    return undefined;
  }

  const products = await getAllProductsAsync();
  return enrichWorkshop(record, products);
}

export function getWorkshopById(id: string): Workshop | undefined {
  const record = workshopRecords.find(
    (workshop) => workshop.id === id && workshop.status === "active",
  );

  return record ? enrichWorkshop(record) : undefined;
}

export function getWorkshopSlugs(): string[] {
  return workshopRecords
    .filter((record) => record.status === "active")
    .map((record) => record.slug);
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
