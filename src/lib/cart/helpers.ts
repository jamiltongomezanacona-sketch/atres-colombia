import type { CartWorkshopGroup } from "@/types/cart";
import type { CartItem } from "@/types/product";

export function groupCartItemsByWorkshop(items: CartItem[]): CartWorkshopGroup[] {
  const groups = new Map<string, CartWorkshopGroup>();

  for (const item of items) {
    const lineSubtotal = item.price * item.quantity;
    const existing = groups.get(item.workshopId);

    if (existing) {
      existing.items.push(item);
      existing.itemCount += item.quantity;
      existing.subtotal += lineSubtotal;
      continue;
    }

    groups.set(item.workshopId, {
      workshopId: item.workshopId,
      workshopSlug: item.workshopSlug,
      workshopName: item.workshopName,
      workshopLocation: item.workshopLocation,
      workshopKind: item.workshopKind,
      items: [item],
      itemCount: item.quantity,
      subtotal: lineSubtotal,
    });
  }

  return Array.from(groups.values());
}

export function getCartLineSubtotal(item: CartItem): number {
  return item.price * item.quantity;
}

export const SIMULATED_SHIPPING_COST = 12000;

export function calculateSimulatedShipping(itemCount: number): number {
  if (itemCount === 0) {
    return 0;
  }

  return SIMULATED_SHIPPING_COST;
}

export function calculateCartTotal(subtotal: number, shipping: number): number {
  return subtotal + shipping;
}
