# SUPABASE_READ_AUDIT.md — Auditoría de lectura de datos

**Fecha:** 2026-07-02  
**Proyecto:** `kzjemhpldchrcqwuchjh`  
**URL:** `https://kzjemhpldchrcqwuchjh.supabase.co`  
**Alcance:** Solo lectura (`fetch-workshops.ts`, `fetch-products.ts`) — sin modificar diseño.

---

## Resumen ejecutivo

| Pregunta | Resultado |
|----------|-----------|
| ¿Hay error PostgREST? | **No** — `error: null` en todas las consultas |
| ¿La API responde? | **Sí** — HTTP `200` |
| ¿Hay filas visibles para la app? | **No** — `data: []`, `count: 0` |
| ¿Falla el `select()` por columnas inexistentes? | **No** — no hay error de schema/columnas |
| ¿Falla el filtro `status = 'active'`? | **No** — sin filtro tampoco hay filas |
| ¿Por qué usa fallback local? | **PostgREST devuelve 0 filas** → repositorio interpreta vacío como fallo |

**Punto exacto de fallo:** entre **PostgREST (respuesta vacía para rol `anon`)** y **`loadProductsAsync` / `loadWorkshopsAsync`** que hacen fallback cuando `length === 0`.

---

## 1. Ejecución de `fetch-workshops.ts` y `fetch-products.ts`

Script ejecutado: `node scripts/audit-supabase-read.mjs`  
Replica las queries exactas de la app, **sin fallback**.

### Configuración detectada

```
url: https://kzjemhpldchrcqwuchjh.supabase.co
anonKey format: publishable (sb_publishable_...)
```

---

## 2. Resultados en consola (error / data)

### WORKSHOPS — query de `fetch-workshops.ts`

```sql
SELECT <WORKSHOP_SELECT>
FROM workshops
WHERE status = 'active'
ORDER BY name ASC
LIMIT 500
```

```
error: null
data: { "length": 0, "sample": [] }
```

### WORKSHOPS — sin filtro `status`

```
error: null
data: { "length": 0, "sample": [] }
```

### WORKSHOPS — count total

```
error: null
count: 0
```

### PRODUCTS — query de `fetch-products.ts`

```sql
SELECT <PRODUCT_SELECT con joins>
FROM products
WHERE status = 'active'
ORDER BY created_at ASC
LIMIT 1000
```

```
error: null
data: { "length": 0, "sample": [] }
```

### PRODUCTS — columnas mínimas (sin joins)

```
error: null
data: { "length": 0, "sample": [] }
```

### PRODUCTS — count total

```
error: null
count: 0
```

### REST directo (curl equivalente)

```
GET /rest/v1/workshops?select=slug,status
HTTP: 200
BODY: []
Content-Range: */*
```

---

## 3. Errores PostgREST

**No se produjo ningún error PostgREST.**

No apareció:
- `PGRST204` (columna inexistente)
- `PGRST200` (relación/join inválido)
- `42501` (permiso denegado explícito)
- `401` / `403` en las consultas a tablas

El cliente recibe `error: null` y `data: []`.

> En Supabase, cuando **RLS está habilitado sin policy de SELECT para `anon`**, PostgREST suele responder `200` + `[]`, no un error. Los datos existen en el Table Editor (rol `service_role`/dashboard) pero **no son visibles** para la clave pública.

---

## 4. Verificación de columnas en `select()`

### `fetch-workshops.ts` — columnas solicitadas vs `schema.sql` v1.1

| Columna en SELECT | Existe en schema v1.1 |
|-------------------|----------------------|
| id, slug, name, description | ✅ |
| city, department, country | ✅ |
| logo_url, cover_url | ✅ |
| phone, whatsapp, email, website | ✅ |
| verified, rating, review_count | ✅ |
| supports_customization, supports_home_trial | ✅ |
| production_time, minimum_order, status | ✅ |

**Conclusión:** el SELECT de workshops es válido para schema v1.1. No hay error de columnas.

### `fetch-products.ts` — columnas solicitadas vs `schema.sql` v1.1

| Columna / join | Existe en schema v1.1 |
|----------------|----------------------|
| short_description, compare_price | ✅ |
| available, made_to_order, is_new | ✅ |
| material, production_days, care_instructions, origin | ✅ |
| rating, review_count, sold_count | ✅ |
| workshops (id, slug, name) | ✅ FK |
| categories (id, slug, name) | ✅ FK |
| product_images (image_url, alt_text, is_cover) | ✅ |
| product_variants (color_name, color_value, available) | ✅ |

**Conclusión:** el SELECT de products es válido para schema v1.1. Si la BD tuviera solo schema v1 (sin `color_name`, `available`, etc.), **sí** habría error PostgREST — pero no ocurre porque la consulta ni siquiera devuelve filas base.

---

## 5. Verificación de filtros

| Filtro en app | Valor | ¿Causa del vacío? |
|---------------|-------|-------------------|
| `workshops.status = 'active'` | seed usa `'active'` | **No** — sin filtro también devuelve `[]` |
| `products.status = 'active'` | seed usa `'active'` | **No** — sin filtro también devuelve `[]` |
| `published_at` | no usado en fetch | N/A |
| `available` | no usado como filtro | N/A |

**Conclusión:** el problema **no es** un mismatch de `status`. Incluso `SELECT slug, status FROM workshops` (todos los status) devuelve `[]`.

---

## 6. Por qué devuelve `[]` (explicación exacta)

Secuencia observada:

```
1. App llama getSupabaseClient() → cliente creado OK (url + key presentes)
2. supabase.from("workshops").select(...) → { error: null, data: [] }
3. supabase.from("products").select(...) → { error: null, data: [] }
4. counts en todas las tablas (workshops, products, categories, images, variants) → 0
5. HTTP REST directo → 200 + []
```

**Interpretación técnica:**

Los datos que ves en el **Table Editor de Supabase** se leen con privilegios elevados (dashboard / `service_role`). La app usa la **publishable/anon key**, que opera como rol `anon` vía PostgREST.

Si RLS está activo en `workshops` y `products` **sin policies** que permitan `SELECT` a `anon`, PostgREST filtra todas las filas y devuelve array vacío sin error.

**Hipótesis principal (muy probable):** RLS habilitado, sin policy de lectura pública.

**Hipótesis secundaria:** datos cargados en otro proyecto/ref de Supabase distinto a `kzjemhpldchrcqwuchjh`.

---

## 7. Punto exacto donde falla el flujo de la app

### Productos — `product-repository.ts`

```typescript
// fetch-products.ts
const { data, error } = await supabase.from("products").select(...).eq("status", "active");
// → error: null, data: []   ← AQUÍ: 0 filas visibles

// product-repository.ts — loadProductsAsync()
const products = await fetchProductsFromSupabase(); // products.length === 0

if (products.length > 0) {
  console.log("Leyendo datos desde Supabase");
  return products;
}

console.log("Usando datos locales");  // ← SE EJECUTA PORQUE length === 0
return loadProductsFromSeeds();
```

**Fallo:** no hay excepción; el vacío se trata igual que un fallo de datos.

### Talleres — `workshop-repository.ts`

```typescript
// fetch-workshops.ts
const { data, error } = await supabase.from("workshops").select(...).eq("status", "active");
// → error: null, data: []   ← AQUÍ: 0 filas visibles

// workshop-repository.ts — loadWorkshopsAsync()
const records = await fetchWorkshopsFromSupabase(); // records.length === 0

if (records.length > 0) {
  console.log("Leyendo datos desde Supabase");
  return records.map(...);
}

console.log("Usando datos locales");  // ← SE EJECUTA PORQUE length === 0
return loadWorkshopsFromSeeds(products);
```

---

## 8. Tablas relacionadas (counts vía anon key)

| Tabla | count (anon) |
|-------|--------------|
| workshops | 0 |
| products | 0 |
| categories | 0 |
| product_images | 0 |
| product_variants | 0 |
| brands | 0 |

Todas las tablas del catálogo devuelven **0 filas visibles** para la clave pública.

---

## 9. Diagnóstico final

```
┌─────────────────────────────────────────────────────────────┐
│  Supabase Dashboard (Table Editor)                          │
│  → Ve datos (service_role / bypass RLS)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  PostgREST + anon/publishable key                           │
│  → 200 OK, error: null, data: []                            │  ← FALLO REAL
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  fetch-workshops.ts / fetch-products.ts                     │
│  → retornan [] (sin throw)                                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  loadWorkshopsAsync / loadProductsAsync                     │
│  → if (length > 0) falla → "Usando datos locales"           │  ← SÍNTOMA EN APP
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Acciones recomendadas (sin cambiar diseño)

### A. Confirmar en Supabase Dashboard

1. **Authentication → Policies** (o Table Editor → RLS)
2. Verificar si `workshops` y `products` tienen **RLS enabled**
3. Si no hay policies para `SELECT` con rol `anon` → esa es la causa

### B. SQL para habilitar lectura pública (staging)

```sql
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_active_workshops"
  ON public.workshops FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "public_read_active_products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "public_read_categories"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_product_images"
  ON public.product_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_product_variants"
  ON public.product_variants FOR SELECT
  TO anon, authenticated
  USING (true);
```

### C. Verificar proyecto correcto

Confirmar que el seed se ejecutó en **`kzjemhpldchrcqwuchjh`**, no en otro proyecto.

### D. Re-ejecutar auditoría

```powershell
Set-Location "c:\Users\ASUS\Desktop\Atrescolombia.com\atres-colombia"
node scripts/audit-supabase-read.mjs
```

Resultado esperado tras corregir RLS:
```
workshops count: 5
products count: 30
error: null
data: { length: 5, sample: [...] }
```

---

## 11. Conclusión

| Componente | Estado |
|------------|--------|
| `.env.local` | ✅ URL y key configurados |
| Cliente Supabase | ✅ Se conecta |
| Columnas `select()` | ✅ Compatibles con schema v1.1 |
| Filtros `status` | ✅ No son la causa |
| PostgREST error | ✅ Ninguno |
| **Datos visibles para anon** | ❌ **0 filas** |
| Fallback local | Consecuencia del vacío, no de un crash |

**Causa raíz:** la clave pública no ve ninguna fila en PostgREST (muy probablemente **RLS sin policies de SELECT**). La app cae en fallback porque `fetch*FromSupabase()` devuelve `[]` sin error.

---

*Auditoría ejecutada con `scripts/audit-supabase-read.mjs`. No se modificó diseño ni lógica de fallback.*
