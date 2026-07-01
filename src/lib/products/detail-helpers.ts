import type { Product, ProductSeed, ProductStockLevel } from "@/types/product";
import { getProductColors, getProductGalleryImages } from "@/lib/products/helpers";

function hashSeedId(id: string): number {
  return id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function inferStockLevel(seed: ProductSeed): ProductStockLevel {
  if (!seed.available) {
    return "out_of_stock";
  }

  if (seed.stockLevel) {
    return seed.stockLevel;
  }

  if (seed.madeToOrder) {
    const hash = hashSeedId(seed.id) % 3;
    return hash === 0 ? "low_stock" : "made_to_order";
  }

  const hash = hashSeedId(seed.id) % 5;
  if (hash === 0) {
    return "low_stock";
  }

  return "in_stock";
}

export function getDefaultProductRating(seed: ProductSeed): number {
  if (seed.rating !== undefined) {
    return seed.rating;
  }

  return 4.4 + (hashSeedId(seed.id) % 6) * 0.1;
}

export function getDefaultReviewCount(seed: ProductSeed): number {
  if (seed.reviewCount !== undefined) {
    return seed.reviewCount;
  }

  return 18 + (hashSeedId(seed.id) % 140);
}

export function getDefaultSoldCount(seed: ProductSeed): number {
  if (seed.soldCount !== undefined) {
    return seed.soldCount;
  }

  return 24 + (hashSeedId(seed.id) % 380);
}

export function getDefaultCareInstructions(seed: ProductSeed): string {
  return (
    seed.careInstructions ??
    "Lavar a mano o en ciclo suave con agua fria. No usar blanqueador. Secar a la sombra y planchar a temperatura baja."
  );
}

export function getDefaultOrigin(seed: ProductSeed): string {
  return seed.origin ?? "Confeccionado en Colombia por talleres locales verificados.";
}

export function getImageForColor(product: Product, colorName: string): string {
  const colors = getProductColors(product);
  const images = getProductGalleryImages(product);
  const colorIndex = colors.findIndex((color) => color.name === colorName);

  if (colorIndex >= 0 && colorIndex < images.length) {
    return images[colorIndex].url;
  }

  return images[0]?.url ?? "";
}

export type AvailabilityInfo = {
  label: string;
  detail: string;
  tone: "success" | "warning" | "info" | "danger";
};

export function getProductAvailability(product: Product): AvailabilityInfo {
  switch (product.stockLevel) {
    case "in_stock":
      return {
        label: "En stock",
        detail: product.fabricationTime ?? "Listo para despacho desde el taller",
        tone: "success",
      };
    case "low_stock":
      return {
        label: "Pocas unidades",
        detail: "Quedan pocas piezas disponibles en este color y talla",
        tone: "warning",
      };
    case "made_to_order":
      return {
        label: "Fabricacion bajo pedido",
        detail: product.fabricationTime ?? "El taller confecciona tu prenda al confirmar el pedido",
        tone: "info",
      };
    case "out_of_stock":
      return {
        label: "Agotado",
        detail: "Temporalmente sin unidades. Consulta al taller por reposicion",
        tone: "danger",
      };
    default:
      return {
        label: product.available ? "Disponible" : "No disponible",
        detail: product.fabricationTime ?? "",
        tone: product.available ? "success" : "danger",
      };
  }
}

export const CUSTOMIZATION_OPTIONS = [
  "Cambiar talla",
  "Cambiar color",
  "Bordado",
  "Diseno personalizado",
] as const;
