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
import type { CartWorkshopGroup } from "@/types/cart";
import type { CartItem, Product } from "@/types/product";
import {
  calculateCartTotal,
  calculateSimulatedShipping,
  groupCartItemsByWorkshop,
} from "@/lib/cart/helpers";
import { getPrimaryImageUrl } from "@/lib/products/helpers";
import { getProductBySlug, getWorkshopBySlug } from "@/lib/repositories";

type AddToCartInput = {
  product: Product;
  color: string;
  size: string;
};

type CartContextValue = {
  items: CartItem[];
  groups: CartWorkshopGroup[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  addItem: (input: AddToCartInput) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "atres-colombia-cart";
const CartContext = createContext<CartContextValue | undefined>(undefined);

function getItemKey(item: Pick<CartItem, "productId" | "color" | "size">) {
  return item.productId + ":" + item.color + ":" + item.size;
}

function enrichCartItem(item: CartItem): CartItem {
  if (item.workshopId && item.workshopName && item.workshopLocation) {
    return item;
  }

  const product = getProductBySlug(item.slug);

  if (!product) {
    return item;
  }

  const workshop = getWorkshopBySlug(product.workshopSlug);

  return {
    ...item,
    workshopId: product.workshopId,
    workshopSlug: product.workshopSlug,
    workshopName: product.workshopName,
    workshopLocation: workshop?.location ?? "",
    workshopKind: workshop?.kind ?? "workshop",
  };
}

function migrateCartItems(items: CartItem[]): CartItem[] {
  return items.map(enrichCartItem);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedCart = window.localStorage.getItem(STORAGE_KEY);

    if (storedCart) {
      setItems(migrateCartItems(JSON.parse(storedCart) as CartItem[]));
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [isReady, items]);

  const addItem = useCallback(({ product, color, size }: AddToCartInput) => {
    const workshop = getWorkshopBySlug(product.workshopSlug);

    setItems((currentItems) => {
      const nextItem: CartItem = {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: getPrimaryImageUrl(product),
        color,
        size,
        quantity: 1,
        workshopId: product.workshopId,
        workshopSlug: product.workshopSlug,
        workshopName: product.workshopName,
        workshopLocation: workshop?.location ?? "",
        workshopKind: workshop?.kind ?? "workshop",
      };
      const nextKey = getItemKey(nextItem);
      const existingItem = currentItems.find(
        (item) => getItemKey(item) === nextKey,
      );

      if (!existingItem) {
        return [...currentItems, nextItem];
      }

      return currentItems.map((item) =>
        getItemKey(item) === nextKey
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => getItemKey(item) !== key),
    );
  }, []);

  const updateQuantity = useCallback(
    (key: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(key);
        return;
      }

      setItems((currentItems) =>
        currentItems.map((item) =>
          getItemKey(item) === key ? { ...item, quantity } : item,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    const groups = groupCartItemsByWorkshop(items);
    const shipping = calculateSimulatedShipping(count);
    const total = calculateCartTotal(subtotal, shipping);

    return {
      items,
      groups,
      count,
      subtotal,
      shipping,
      total,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    };
  }, [addItem, clearCart, items, removeItem, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}

export function getCartItemKey(
  item: Pick<CartItem, "productId" | "color" | "size">,
) {
  return getItemKey(item);
}
