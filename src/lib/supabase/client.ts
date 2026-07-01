import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/config";

let browserClient: SupabaseClient | null = null;

/** Cliente Supabase para lectura publica con anon key. */
export function createSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { url, anonKey } = getSupabaseEnv();
  return createClient(url, anonKey);
}

/** Singleton en el navegador; en servidor crea instancia por llamada. */
export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === "undefined") {
    return createSupabaseClient();
  }

  if (!browserClient) {
    browserClient = createSupabaseClient();
  }

  return browserClient;
}
