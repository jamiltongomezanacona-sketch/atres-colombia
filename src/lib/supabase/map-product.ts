import type {
  Product,
  ProductImage,
  ProductStockLevel,
  ProductVariant,
} from "@/types/product";

type SupabaseWorkshopRow = {
  id: string;
  slug: string;
  name: string;
};

type SupabaseCategoryRow = {
  id: string;
  slug: string;
  name: string;
};

type SupabaseProductImageRow = {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number | null;
  is_cover: boolean | null;
};

type SupabaseProductVariantRow = {
  id: string;
  color_name: string;
  color_value: string;
  size: string;
  sku: string | null;
  stock: number | null;
  available: boolean | null;
};

export type SupabaseProductRow = {
  id: string;
  slug: string;
  workshop_id: string;
  category_id: string;
  name: string;
  short_description: string;
  description: string;
  price: number;
  compare_price: number | null;
  stock: number | null;
  available: boolean;
  made_to_order: boolean;
  is_new: boolean | null;
  material: string | null;
  production_days: number | null;
  care_instructions: string | null;
  origin: string | null;
  rating: number | null;
  review_count: number | null;
  sold_count: number | null;
  status: string | null;
  workshops: SupabaseWorkshopRow | SupabaseWorkshopRow[] | null;
  categories: SupabaseCategoryRow | SupabaseCategoryRow[] | null;
  product_images: SupabaseProductImageRow[] | null;
  product_variants: SupabaseProductVariantRow[] | null;
};

function unwrapRelation<T>(value: T | T[] | null): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function computeDiscount(
  price: number,
  comparePrice: number | null,
): string | undefined {
  if (!comparePrice || comparePrice <= price) {
    return undefined;
  }

  const percent = Math.round(((comparePrice - price) / comparePrice) * 100);
  return `-${percent}%`;
}

function formatProductionDays(days: number | null): string | undefined {
  if (days == null || days <= 0) {
    return undefined;
  }

  return `${days} dias habiles`;
}

function sumVariantStock(row: SupabaseProductRow): number {
  const variants = row.product_variants ?? [];

  if (variants.length === 0) {
    return row.stock ?? 0;
  }

  return variants.reduce((total, variant) => total + (variant.stock ?? 0), 0);
}

function inferStockLevel(row: SupabaseProductRow): ProductStockLevel {
  if (!row.available) {
    return "out_of_stock";
  }

  if (row.made_to_order) {
    const totalStock = sumVariantStock(row);
    return totalStock > 0 && totalStock <= 5 ? "low_stock" : "made_to_order";
  }

  const totalStock = sumVariantStock(row);

  if (totalStock <= 0) {
    return "out_of_stock";
  }

  if (totalStock <= 5) {
    return "low_stock";
  }

  return "in_stock";
}

function mapImages(row: SupabaseProductRow): ProductImage[] {
  const images = [...(row.product_images ?? [])].sort((a, b) => {
    if (a.is_cover && !b.is_cover) {
      return -1;
    }

    if (!a.is_cover && b.is_cover) {
      return 1;
    }

    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });

  if (images.length === 0) {
    return [
      {
        id: row.id + "-img-fallback",
        productId: row.id,
        url: "/placeholders/textura-taller.svg",
        alt: row.name,
        sortOrder: 0,
      },
    ];
  }

  return images.map((image, index) => ({
    id: image.id,
    productId: row.id,
    url: image.image_url,
    alt: image.alt_text ?? row.name,
    sortOrder: image.sort_order ?? index,
  }));
}

function mapVariants(row: SupabaseProductRow): ProductVariant[] {
  const variants = row.product_variants ?? [];

  if (variants.length === 0) {
    return [
      {
        id: row.id + "-variant-default",
        productId: row.id,
        colorName: "Unico",
        colorValue: "#111111",
        size: "Unica",
        available: row.available,
      },
    ];
  }

  return variants.map((variant) => ({
    id: variant.id,
    productId: row.id,
    colorName: variant.color_name,
    colorValue: variant.color_value,
    size: variant.size,
    sku: variant.sku ?? undefined,
    stock: variant.stock ?? undefined,
    available: variant.available ?? row.available,
  }));
}

export function mapSupabaseProductRow(row: SupabaseProductRow): Product | null {
  const workshop = unwrapRelation(row.workshops);
  const category = unwrapRelation(row.categories);

  if (!workshop || !category) {
    return null;
  }

  return {
    id: row.id,
    slug: row.slug,
    workshopId: workshop.id,
    workshopSlug: workshop.slug,
    workshopName: workshop.name,
    categoryId: category.slug,
    categoryName: category.name,
    name: row.name,
    description: row.short_description,
    longDescription: row.description,
    price: row.price,
    previousPrice: row.compare_price ?? undefined,
    discount: computeDiscount(row.price, row.compare_price),
    images: mapImages(row),
    variants: mapVariants(row),
    available: row.available,
    madeToOrder: row.made_to_order,
    isNew: row.is_new ?? undefined,
    material: row.material ?? undefined,
    fabricationTime: formatProductionDays(row.production_days),
    rating: row.rating ?? 4.5,
    reviewCount: row.review_count ?? 0,
    soldCount: row.sold_count ?? 0,
    careInstructions:
      row.care_instructions ??
      "Lavar a mano o en ciclo suave con agua fria. No usar blanqueador. Secar a la sombra y planchar a temperatura baja.",
    origin:
      row.origin ??
      "Confeccionado en Colombia por talleres locales verificados.",
    stockLevel: inferStockLevel(row),
  };
}

export function mapSupabaseProductRows(rows: SupabaseProductRow[]): Product[] {
  return rows
    .map(mapSupabaseProductRow)
    .filter((product): product is Product => product !== null);
}
