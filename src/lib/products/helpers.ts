import type { Product, ProductColor } from "@/types/product";

export function getProductColors(product: Product): ProductColor[] {
  const colors = new Map<string, ProductColor>();

  for (const variant of product.variants) {
    colors.set(variant.colorName, {
      name: variant.colorName,
      value: variant.colorValue,
    });
  }

  return Array.from(colors.values());
}

export function getProductSizes(product: Product): string[] {
  return [...new Set(product.variants.map((variant) => variant.size))];
}

export function getProductImageUrls(product: Product): string[] {
  return [...product.images]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((image) => image.url);
}

export function getPrimaryImageUrl(product: Product): string {
  return getProductImageUrls(product)[0] ?? "";
}

export function getProductGalleryImages(product: Product) {
  return [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
}
