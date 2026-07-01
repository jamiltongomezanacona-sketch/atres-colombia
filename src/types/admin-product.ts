import type { ProductColor, ProductStockLevel } from "@/types/product";

export type AdminProductStatus = "active" | "inactive";

export type AdminProduct = {
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
  stock: number;
  available: boolean;
  madeToOrder: boolean;
  allowsCustomization: boolean;
  allowsHomeTrial: boolean;
  status: AdminProductStatus;
  stockLevel: ProductStockLevel;
  material?: string;
  fabricationTime?: string;
};

export type AdminProductInput = {
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
  stock: number;
  available: boolean;
  madeToOrder: boolean;
  allowsCustomization: boolean;
  allowsHomeTrial: boolean;
  material?: string;
  fabricationTime?: string;
};

export type AdminProductFormValues = AdminProductInput;

export type AdminDashboardStats = {
  totalProducts: number;
  activeProducts: number;
  madeToOrderProducts: number;
  outOfStockProducts: number;
  totalWorkshops: number;
};

export type AdminProductFilters = {
  query: string;
  workshopId: string;
  categoryId: string;
};
