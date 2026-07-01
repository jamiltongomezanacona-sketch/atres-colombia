import type { Product, ProductSeed } from "@/types/product";
import {
  getDefaultCareInstructions,
  getDefaultOrigin,
  getDefaultProductRating,
  getDefaultReviewCount,
  getDefaultSoldCount,
  inferStockLevel,
} from "@/lib/products/detail-helpers";

export function normalizeProduct(seed: ProductSeed): Product {
  const images = seed.imageUrls.map((url, index) => ({
    id: seed.id + "-img-" + index,
    productId: seed.id,
    url,
    alt: seed.name,
    sortOrder: index,
  }));

  const variants = seed.colors.flatMap((color) =>
    seed.sizes.map((size) => ({
      id: seed.id + "-" + color.name + "-" + size,
      productId: seed.id,
      colorName: color.name,
      colorValue: color.value,
      size,
      sku: seed.slug + "-" + size + "-" + color.name.toLowerCase().replace(/\s+/g, "-"),
      available: seed.available,
    })),
  );

  return {
    id: seed.id,
    slug: seed.slug,
    workshopId: seed.workshopId,
    workshopSlug: seed.workshopSlug,
    workshopName: seed.workshopName,
    categoryId: seed.categoryId,
    categoryName: seed.categoryName,
    name: seed.name,
    description: seed.description,
    longDescription: seed.longDescription,
    price: seed.price,
    previousPrice: seed.previousPrice,
    discount: seed.discount,
    images,
    variants,
    available: seed.available,
    madeToOrder: seed.madeToOrder,
    isNew: seed.isNew,
    material: seed.material,
    fabricationTime: seed.fabricationTime,
    rating: getDefaultProductRating(seed),
    reviewCount: getDefaultReviewCount(seed),
    soldCount: getDefaultSoldCount(seed),
    careInstructions: getDefaultCareInstructions(seed),
    origin: getDefaultOrigin(seed),
    stockLevel: inferStockLevel(seed),
  };
}

export function normalizeProducts(seeds: ProductSeed[]): Product[] {
  return seeds.map(normalizeProduct);
}
