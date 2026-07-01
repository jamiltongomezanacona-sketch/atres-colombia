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
import type { CartItem, Product } from "@/types/product";
import { getPrimaryImageUrl } from "@/lib/products/helpers";

type AddToCartInput = {
  product: Product;
  color: string;
  size: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedCart = window.localStorage.getItem(STORAGE_KEY);

    if (storedCart) {
      setItems(JSON.parse(storedCart) as CartItem[]);
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [isReady, items]);

  const addItem = useCallback(({ product, color, size }: AddToCartInput) => {
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

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        getItemKey(item) === key
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    return {
      items,
      count,
      subtotal,
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
