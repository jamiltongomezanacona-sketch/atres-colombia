import { getSupabaseClient } from "@/lib/supabase/client";
import {
  mapSupabaseProductRows,
  type SupabaseProductRow,
} from "@/lib/supabase/map-product";
import type { Product } from "@/types/product";

/** Limite de seguridad para evitar cargar millones de filas en build/SSR. */
const PRODUCT_FETCH_LIMIT = 1000;

const PRODUCT_SELECT = `
  id,
  slug,
  workshop_id,
  category_id,
  name,
  short_description,
  description,
  price,
  compare_price,
  stock,
  available,
  made_to_order,
  is_new,
  material,
  production_days,
  care_instructions,
  origin,
  rating,
  review_count,
  sold_count,
  status,
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
    image_url,
    alt_text,
    sort_order,
    is_cover
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
    .order("created_at", { ascending: true })
    .limit(PRODUCT_FETCH_LIMIT);

  if (error) {
    throw error;
  }

  return mapSupabaseProductRows((data ?? []) as SupabaseProductRow[]);
}
