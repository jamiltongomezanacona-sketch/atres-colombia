import { getSupabaseClient } from "@/lib/supabase/client";
import {
  mapSupabaseWorkshopRows,
  type SupabaseWorkshopRow,
} from "@/lib/supabase/map-workshop";
import type { WorkshopRecord } from "@/types/workshop";

const WORKSHOP_FETCH_LIMIT = 500;

const WORKSHOP_SELECT = `
  id,
  slug,
  name,
  description,
  city,
  department,
  country,
  logo_url,
  cover_url,
  phone,
  whatsapp,
  email,
  website,
  verified,
  rating,
  review_count,
  supports_customization,
  supports_home_trial,
  production_time,
  minimum_order,
  status
`;

export async function fetchWorkshopsFromSupabase(): Promise<WorkshopRecord[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("workshops")
    .select(WORKSHOP_SELECT)
    .eq("status", "active")
    .order("name", { ascending: true })
    .limit(WORKSHOP_FETCH_LIMIT);

  if (error) {
    throw error;
  }

  return mapSupabaseWorkshopRows((data ?? []) as SupabaseWorkshopRow[]);
}
