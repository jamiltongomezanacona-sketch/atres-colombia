/**
 * Auditoria de lectura Supabase — sin fallback.
 * Ejecutar: node scripts/audit-supabase-read.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvLocal() {
  const envPath = resolve(root, ".env.local");
  const content = readFileSync(envPath, "utf8");
  const env = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }

  return env;
}

function printSection(title) {
  console.log("\n" + "=".repeat(72));
  console.log(title);
  console.log("=".repeat(72));
}

function printResult(label, { data, error, count }) {
  console.log(`\n--- ${label} ---`);
  if (error) {
    console.log("error:", JSON.stringify(error, null, 2));
    console.log("error.message:", error.message);
    console.log("error.details:", error.details);
    console.log("error.hint:", error.hint);
    console.log("error.code:", error.code);
  } else {
    console.log("error: null");
  }
  if (count !== undefined) {
    console.log("count:", count);
  }
  if (data !== undefined) {
    const preview = Array.isArray(data)
      ? { length: data.length, sample: data.slice(0, 2) }
      : data;
    console.log("data:", JSON.stringify(preview, null, 2));
  }
}

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

async function main() {
  const env = loadEnvLocal();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  printSection("CONFIG");
  console.log("url:", url);
  console.log("anonKey prefix:", anonKey ? anonKey.slice(0, 20) + "..." : "(vacío)");
  console.log("anonKey format:", anonKey?.startsWith("eyJ") ? "JWT (legacy)" : anonKey?.startsWith("sb_publishable_") ? "publishable (nuevo)" : "desconocido");

  if (!url || !anonKey) {
    console.error("FALTA url o anonKey en .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, anonKey);

  // --- WORKSHOPS: sin filtro ---
  printSection("WORKSHOPS — count sin filtro");
  const wsCount = await supabase.from("workshops").select("id", { count: "exact", head: true });
  printResult("workshops count", { data: null, error: wsCount.error, count: wsCount.count });

  printSection("WORKSHOPS — status distintos en BD");
  const wsStatuses = await supabase.from("workshops").select("slug, status");
  printResult("workshops slug+status (todos)", wsStatuses);

  printSection("WORKSHOPS — fetch-workshops.ts (status=active)");
  const wsActive = await supabase
    .from("workshops")
    .select(WORKSHOP_SELECT)
    .eq("status", "active")
    .order("name", { ascending: true })
    .limit(500);
  printResult("workshops active (query app)", wsActive);

  printSection("WORKSHOPS — sin filtro status");
  const wsAll = await supabase.from("workshops").select(WORKSHOP_SELECT).limit(5);
  printResult("workshops sin filtro (5)", wsAll);

  // --- PRODUCTS: sin filtro ---
  printSection("PRODUCTS — count sin filtro");
  const prCount = await supabase.from("products").select("id", { count: "exact", head: true });
  printResult("products count", { data: null, error: prCount.error, count: prCount.count });

  printSection("PRODUCTS — status distintos en BD");
  const prStatuses = await supabase.from("products").select("slug, status");
  printResult("products slug+status (todos)", prStatuses);

  printSection("PRODUCTS — columnas minimas (sin joins)");
  const prMinimal = await supabase
    .from("products")
    .select("id, slug, status, workshop_id, category_id")
    .eq("status", "active")
    .limit(3);
  printResult("products minimal active", prMinimal);

  printSection("PRODUCTS — fetch-products.ts (select completo + status=active)");
  const prFull = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1000);
  printResult("products full (query app)", prFull);

  // --- Probar joins por separado si falla ---
  if (prFull.error) {
    printSection("PRODUCTS — diagnostico joins por partes");

    const prNoJoins = await supabase
      .from("products")
      .select("id, slug, status")
      .eq("status", "active")
      .limit(2);
    printResult("products sin joins", prNoJoins);

    const prWorkshopJoin = await supabase
      .from("products")
      .select("id, slug, workshops(id, slug, name)")
      .eq("status", "active")
      .limit(2);
    printResult("products + workshops join", prWorkshopJoin);

    const prCategoryJoin = await supabase
      .from("products")
      .select("id, slug, categories(id, slug, name)")
      .eq("status", "active")
      .limit(2);
    printResult("products + categories join", prCategoryJoin);

    const prImagesJoin = await supabase
      .from("products")
      .select("id, slug, product_images(id, image_url, alt_text, sort_order, is_cover)")
      .eq("status", "active")
      .limit(2);
    printResult("products + product_images join", prImagesJoin);

    const prVariantsJoin = await supabase
      .from("products")
      .select("id, slug, product_variants(id, color_name, color_value, size, sku, stock, available)")
      .eq("status", "active")
      .limit(2);
    printResult("products + product_variants join", prVariantsJoin);

    // Probar columnas v1 antiguas por si schema en BD es v1
    const prV1Variants = await supabase
      .from("products")
      .select("id, slug, product_variants(id, color, size, sku, stock)")
      .eq("status", "active")
      .limit(2);
    printResult("products + variants v1 (color)", prV1Variants);
  }

  // --- Verificar tablas relacionadas ---
  printSection("TABLAS RELACIONADAS — counts");
  for (const table of ["categories", "product_images", "product_variants", "brands"]) {
    const r = await supabase.from(table).select("id", { count: "exact", head: true });
    printResult(`${table} count`, { data: null, error: r.error, count: r.count });
  }

  // --- RLS probe: intentar lectura anon ---
  printSection("RLS — lectura anon en workshops/products");
  const rlsWs = await supabase.from("workshops").select("id").limit(1);
  const rlsPr = await supabase.from("products").select("id").limit(1);
  console.log("workshops readable:", !rlsWs.error && (rlsWs.data?.length ?? 0) > 0 ? "SI" : rlsWs.error ? "ERROR" : "VACIO (posible RLS)");
  console.log("products readable:", !rlsPr.error && (rlsPr.data?.length ?? 0) > 0 ? "SI" : rlsPr.error ? "ERROR" : "VACIO (posible RLS)");
  if (rlsWs.error) console.log("workshops RLS error:", JSON.stringify(rlsWs.error, null, 2));
  if (rlsPr.error) console.log("products RLS error:", JSON.stringify(rlsPr.error, null, 2));

  printSection("FIN AUDITORIA");
}

main().catch((err) => {
  console.error("SCRIPT CRASH:", err);
  process.exit(1);
});
