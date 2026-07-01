import { getSupabaseClient } from "@/lib/supabase/client";
import {
  mapSupabaseProductRows,
  type SupabaseProductRow,
} from "@/lib/supabase/map-product";
import type { Product } from "@/types/product";

const PRODUCT_SELECT = `
  id,
  slug,
  workshop_id,
  category_id,
  name,
  description,
  long_description,
  price,
  previous_price,
  discount_label,
  available,
  made_to_order,
  stock_level,
  status,
  is_new,
  material,
  fabrication_time,
  care_instructions,
  origin,
  rating,
  review_count,
  sold_count,
  workshops (
    id,
    slug,
    name
  ),
  categories (
    id,
    slug,
    name
  ),
  product_images (
    id,
    url,
    alt_text,
    sort_order
  ),
  product_variants (
    id,
    color_name,
    color_value,
    size,
    sku,
    stock,
    available
  )
`;

export async function fetchProductsFromSupabase(): Promise<Product[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return mapSupabaseProductRows((data ?? []) as SupabaseProductRow[]);
}
