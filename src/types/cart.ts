import type { WorkshopKind } from "@/types/workshop";
import type { CartItem } from "@/types/product";

export type CartWorkshopGroup = {
  workshopId: string;
  workshopSlug: string;
  workshopName: string;
  workshopLocation: string;
  workshopKind: WorkshopKind;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
};
