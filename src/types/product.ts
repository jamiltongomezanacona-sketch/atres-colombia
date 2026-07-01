export type ProductColor = {
  name: string;
  value: string;
};

export type ProductStockLevel =
  | "in_stock"
  | "low_stock"
  | "made_to_order"
  | "out_of_stock";

export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  alt: string;
  sortOrder: number;
};

export type ProductVariant = {
  id: string;
  productId: string;
  colorName: string;
  colorValue: string;
  size: string;
  sku?: string;
  stock?: number;
  available: boolean;
};

export type Product = {
  id: string;
  slug: string;
  workshopId: string;
  workshopSlug: string;
  workshopName: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  previousPrice?: number;
  discount?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  available: boolean;
  madeToOrder: boolean;
  isNew?: boolean;
  material?: string;
  fabricationTime?: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  careInstructions: string;
  origin: string;
  stockLevel: ProductStockLevel;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
};

/** Entrada simplificada para data/; se normaliza en el repositorio. */
export type ProductSeed = {
  id: string;
  slug: string;
  workshopId: string;
  workshopSlug: string;
  workshopName: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  previousPrice?: number;
  discount?: string;
  colors: ProductColor[];
  sizes: string[];
  imageUrls: string[];
  available: boolean;
  madeToOrder: boolean;
  isNew?: boolean;
  material?: string;
  fabricationTime?: string;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  careInstructions?: string;
  origin?: string;
  stockLevel?: ProductStockLevel;
};
