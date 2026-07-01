import type { Workshop } from "@/types/workshop";
import type { Product } from "@/types/product";
import { products } from "@/data/products";
import { filterProducts } from "@/lib/catalog";

export function filterWorkshops(workshops: Workshop[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return workshops;
  }

  const matchingProductWorkshopIds = new Set(
    filterProducts(products, query).map((product) => product.workshopId),
  );

  return workshops.filter((workshop) => {
    const searchableText = [
      workshop.name,
      workshop.location,
      workshop.description,
      ...workshop.specialties,
    ]
      .join(" ")
      .toLowerCase();

    return (
      searchableText.includes(normalizedQuery) ||
      matchingProductWorkshopIds.has(workshop.id)
    );
  });
}

export function getProductsForWorkshop(workshop: Workshop): Product[] {
  return workshop.productIds
    .map((productId) => products.find((product) => product.id === productId))
    .filter((product): product is Product => product !== undefined);
}

export function getProductCountForWorkshop(workshop: Workshop) {
  return getProductsForWorkshop(workshop).length;
}
