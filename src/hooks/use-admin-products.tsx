"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ADMIN_PRODUCTS_STORAGE_KEY,
  buildDashboardStats,
  createAdminProductId,
  createUniqueSlug,
  getInitialAdminProducts,
  resolveStockLevel,
} from "@/lib/admin/helpers";
import { getAllWorkshops } from "@/lib/repositories";
import type {
  AdminDashboardStats,
  AdminProduct,
  AdminProductFormValues,
} from "@/types/admin-product";

type AdminProductsContextValue = {
  products: AdminProduct[];
  isReady: boolean;
  stats: AdminDashboardStats;
  getProductById: (id: string) => AdminProduct | undefined;
  createProduct: (values: AdminProductFormValues) => AdminProduct;
  updateProduct: (id: string, values: AdminProductFormValues) => AdminProduct | undefined;
  deactivateProduct: (id: string) => void;
};

const AdminProductsContext = createContext<AdminProductsContextValue | undefined>(
  undefined,
);

function normalizeProduct(values: AdminProductFormValues, existing?: AdminProduct): AdminProduct {
  const stockLevel = resolveStockLevel(values);

  return {
    id: existing?.id ?? createAdminProductId(),
    slug: existing?.slug ?? "",
    workshopId: values.workshopId,
    workshopSlug: values.workshopSlug,
    workshopName: values.workshopName,
    categoryId: values.categoryId,
    categoryName: values.categoryName,
    name: values.name,
    description: values.description,
    longDescription: values.longDescription,
    price: values.price,
    previousPrice: values.previousPrice,
    discount: values.discount,
    colors: values.colors,
    sizes: values.sizes,
    imageUrls: values.imageUrls,
    stock: values.stock,
    available: values.available,
    madeToOrder: values.madeToOrder,
    allowsCustomization: values.allowsCustomization,
    allowsHomeTrial: values.allowsHomeTrial,
    status: existing?.status ?? "active",
    stockLevel,
    material: values.material,
    fabricationTime: values.fabricationTime,
  };
}

export function AdminProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(ADMIN_PRODUCTS_STORAGE_KEY);

    if (stored) {
      setProducts(JSON.parse(stored) as AdminProduct[]);
    } else {
      setProducts(getInitialAdminProducts());
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      window.localStorage.setItem(
        ADMIN_PRODUCTS_STORAGE_KEY,
        JSON.stringify(products),
      );
    }
  }, [isReady, products]);

  const getProductById = useCallback(
    (id: string) => products.find((product) => product.id === id),
    [products],
  );

  const createProduct = useCallback(
    (values: AdminProductFormValues) => {
      const slug = createUniqueSlug(values.name, products);
      const nextProduct = normalizeProduct(values);
      nextProduct.slug = slug;

      setProducts((current) => [...current, nextProduct]);
      return nextProduct;
    },
    [products],
  );

  const updateProduct = useCallback(
    (id: string, values: AdminProductFormValues) => {
      let updated: AdminProduct | undefined;

      setProducts((current) =>
        current.map((product) => {
          if (product.id !== id) {
            return product;
          }

          updated = normalizeProduct(values, product);
          updated.slug = product.slug;
          return updated;
        }),
      );

      return updated;
    },
    [],
  );

  const deactivateProduct = useCallback((id: string) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? {
              ...product,
              status: "inactive",
              available: false,
              stockLevel: "out_of_stock",
            }
          : product,
      ),
    );
  }, []);

  const stats = useMemo(
    () => buildDashboardStats(products, getAllWorkshops().length),
    [products],
  );

  const value = useMemo<AdminProductsContextValue>(
    () => ({
      products,
      isReady,
      stats,
      getProductById,
      createProduct,
      updateProduct,
      deactivateProduct,
    }),
    [
      createProduct,
      deactivateProduct,
      getProductById,
      isReady,
      products,
      stats,
      updateProduct,
    ],
  );

  return (
    <AdminProductsContext.Provider value={value}>
      {children}
    </AdminProductsContext.Provider>
  );
}

export function useAdminProducts() {
  const context = useContext(AdminProductsContext);

  if (!context) {
    throw new Error("useAdminProducts debe usarse dentro de AdminProductsProvider");
  }

  return context;
}
