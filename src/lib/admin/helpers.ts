import { productSeeds } from "@/data/products";
import { getWorkshopById } from "@/lib/repositories/workshop-repository";
import { inferStockLevel } from "@/lib/products/detail-helpers";
import type { AdminProduct, AdminProductFilters, AdminDashboardStats } from "@/types/admin-product";
import type { ProductSeed } from "@/types/product";

export const ADMIN_PRODUCTS_STORAGE_KEY = "atres-colombia-admin-products";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function seedToAdminProduct(seed: ProductSeed): AdminProduct {
  const workshop = getWorkshopById(seed.workshopId);
  const stockLevel = inferStockLevel(seed);

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
    colors: seed.colors,
    sizes: seed.sizes,
    imageUrls: seed.imageUrls,
    stock: stockLevel === "out_of_stock" ? 0 : stockLevel === "low_stock" ? 3 : 12,
    available: seed.available,
    madeToOrder: seed.madeToOrder,
    allowsCustomization: workshop?.supportsCustomization ?? false,
    allowsHomeTrial: workshop?.supportsHomeTrial ?? false,
    status: seed.available ? "active" : "inactive",
    stockLevel,
    material: seed.material,
    fabricationTime: seed.fabricationTime,
  };
}

export function getInitialAdminProducts(): AdminProduct[] {
  return productSeeds.map(seedToAdminProduct);
}

export function resolveStockLevel(product: Pick<AdminProduct, "stock" | "available" | "madeToOrder">): AdminProduct["stockLevel"] {
  if (!product.available || product.stock <= 0) {
    return "out_of_stock";
  }

  if (product.madeToOrder) {
    return product.stock <= 3 ? "low_stock" : "made_to_order";
  }

  if (product.stock <= 3) {
    return "low_stock";
  }

  return "in_stock";
}

export function buildDashboardStats(
  products: AdminProduct[],
  totalWorkshops: number,
): AdminDashboardStats {
  return {
    totalProducts: products.length,
    activeProducts: products.filter(
      (product) => product.status === "active" && product.available,
    ).length,
    madeToOrderProducts: products.filter((product) => product.madeToOrder).length,
    outOfStockProducts: products.filter(
      (product) =>
        product.stockLevel === "out_of_stock" ||
        product.stock <= 0 ||
        !product.available,
    ).length,
    totalWorkshops,
  };
}

export function filterAdminProducts(
  products: AdminProduct[],
  filters: AdminProductFilters,
): AdminProduct[] {
  const query = filters.query.trim().toLowerCase();

  return products.filter((product) => {
    if (filters.workshopId && product.workshopId !== filters.workshopId) {
      return false;
    }

    if (filters.categoryId && product.categoryId !== filters.categoryId) {
      return false;
    }

    if (!query) {
      return true;
    }

    const searchable = [
      product.name,
      product.description,
      product.workshopName,
      product.categoryName,
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(query);
  });
}

export function createAdminProductId(): string {
  return "prod-admin-" + Date.now().toString(36);
}

export function createUniqueSlug(name: string, products: AdminProduct[]): string {
  const baseSlug = slugify(name) || "producto-nuevo";
  let slug = baseSlug;
  let counter = 2;

  while (products.some((product) => product.slug === slug)) {
    slug = baseSlug + "-" + counter;
    counter += 1;
  }

  return slug;
}
