# AtresColombia — Modelo de datos (v1)

Documentación del esquema definido en [`supabase/schema.sql`](./supabase/schema.sql).

AtresColombia **no es un marketplace de marcas**. Es una plataforma donde cada **taller o tienda** publica su propio catálogo. La entidad raíz del negocio es `workshops`.

Este documento explica el propósito de cada tabla y cómo el modelo escala cuando la plataforma crezca a cientos de talleres.

---

## Visión general

```
workshops (taller / tienda)
    ├── brands (opcional)
    └── products
            ├── product_images
            └── product_variants

categories (global)
    └── products
```

| Capa | Tablas | Rol |
|------|--------|-----|
| Identidad comercial | `workshops`, `brands` | Quién vende y bajo qué marca (opcional) |
| Taxonomía | `categories` | Clasificación transversal de la plataforma |
| Catálogo | `products` | Prenda o artículo publicado |
| Detalle | `product_images`, `product_variants` | Galería e inventario por color/talla |

---

## Tabla: `workshops`

**Propósito:** Representar cada punto de confección o tienda verificada en Colombia.

Es la entidad principal. Todo producto pertenece a un taller. En la UI actual esto se refleja en:

- Tarjetas de taller en home y `/talleres`
- Catálogo individual en `/talleres/[slug]/catalogo`
- Carrito agrupado por taller (Sprint 4)

**Campos clave:**

| Campo | Uso |
|-------|-----|
| `slug` | URL pública: `/talleres/atres-colombia` |
| `verified` | Badge "Taller verificado" / "Tienda verificada" |
| `whatsapp` | Contacto directo para pedidos |
| `supports_customization` / `supports_home_trial` | Servicios del taller |
| `status` | Control de visibilidad (`active`, `pending`, `inactive`) |

**Escalabilidad (cientos de talleres):**

- Índices en `status`, `city` y `(verified, status)` permiten listados rápidos por ciudad y talleres activos.
- `slug` único garantiza rutas estables sin colisiones.
- `rating` y `review_count` preparan reseñas futuras sin tabla adicional todavía.
- Separar `city` y `department` facilita filtros geográficos y logística por regiones.

---

## Tabla: `brands`

**Propósito:** Marca comercial **opcional** dentro de un taller.

No todos los talleres necesitan marca propia (ej. un taller de uniformes puede vender sin marca). Cuando exista, un producto puede referenciar `brand_id`.

**Relación:** `brands.workshop_id` → `workshops.id` (CASCADE al eliminar taller).

**Escalabilidad:**

- Un taller puede tener varias marcas (línea premium, línea escolar, etc.).
- `UNIQUE (workshop_id, slug)` evita duplicados por taller sin bloquear el mismo slug en otro taller.
- Si la plataforma crece y las marcas ganan peso, se pueden añadir campos de marketing sin tocar `workshops`.

---

## Tabla: `categories`

**Propósito:** Taxonomía **global** compartida por toda la plataforma.

Ejemplos: Chaquetas, Camisas, Calzado, Uniformes. Los productos de cualquier taller usan la misma categoría para filtros coherentes.

**Relación:** `products.category_id` → `categories.id`

**Escalabilidad:**

- Catálogo pequeño al inicio (7–10 categorías); crecimiento controlado por admins de plataforma.
- `icon` y `description` soportan navegación visual en home y filtros del catálogo por taller.
- `slug` estable permite URLs y filtros sin depender del UUID.
- Con cientos de talleres, las categorías no se duplican: un solo árbol mantiene la UX consistente.

---

## Tabla: `products`

**Propósito:** Artículo publicado por un taller en el catálogo público.

Centraliza precio, stock agregado, estado de publicación y flags de servicios.

**Relaciones:**

| FK | Comportamiento |
|----|----------------|
| `workshop_id` | RESTRICT — no borrar taller con productos |
| `category_id` | RESTRICT — no borrar categoría en uso |
| `brand_id` | SET NULL — marca opcional |

**Campos clave:**

| Campo | Uso |
|-------|-----|
| `slug` | URL: `/productos/chaqueta-bogota-verde` |
| `short_description` | Tarjetas y listado vertical |
| `description` | Detalle del producto |
| `compare_price` | Precio tachado / descuento |
| `status` | `draft`, `active`, `inactive`, `archived` |
| `featured` | Destacados en home o promociones |
| `production_days` | Fabricación bajo pedido |

**Escalabilidad:**

- Índice compuesto `(workshop_id, status)` optimiza el catálogo por taller (caso más frecuente).
- `slug` único global mantiene rutas actuales de Next.js sin ambigüedad.
- `stock` a nivel producto + detalle en variantes permite operación simple al inicio y granularidad después.
- `archived` preserva historial sin borrar filas (importante para analytics futuros).
- Con cientos de talleres × decenas de productos = miles de filas: PostgreSQL maneja esto bien con índices actuales; más adelante se puede particionar por `workshop_id` si fuera necesario.

---

## Tabla: `product_images`

**Propósito:** Galería multimedia de cada producto.

Soporta la UI de detalle (Sprint 3): imagen principal, miniaturas, contador, swipe.

**Relación:** `product_id` → CASCADE (si se elimina el producto, se eliminan sus imágenes).

**Campos clave:**

| Campo | Uso |
|-------|-----|
| `sort_order` | Orden en galería |
| `is_cover` | Imagen principal en listados |
| `image_url` | URL pública o path en Storage (fase posterior) |

**Escalabilidad:**

- Índice único parcial: **una sola portada** por producto (`is_cover = true`).
- CASCADE mantiene integridad sin registros huérfanos.
- Con Storage de Supabase, `image_url` almacenará paths del bucket; el esquema no cambia.

---

## Tabla: `product_variants`

**Propósito:** Inventario y precio por combinación **color + talla**.

Refleja la normalización actual en `src/lib/products/normalize.ts` (colores × tallas).

**Relación:** `product_id` → CASCADE

**Campos clave:**

| Campo | Uso |
|-------|-----|
| `color`, `size` | Selectores en detalle y carrito |
| `stock` | Disponibilidad por variante |
| `price` | Override opcional; NULL usa `products.price` |
| `sku` | Código interno del taller |

**Escalabilidad:**

- `UNIQUE (product_id, color, size)` evita duplicados.
- Índice en `(product_id, stock)` acelera consultas de "pocas unidades" o "agotado".
- Talleres con catálogos grandes (50+ productos × 10+ variantes) siguen siendo manejables; el cuello de botella suele ser la app, no la BD.

---

## Qué NO incluye esta versión (próximas fases)

Definido en [`SUPABASE_PLAN.md`](./SUPABASE_PLAN.md) para cuando el negocio lo requiera:

| Fase futura | Tablas / features |
|-------------|-------------------|
| Auth | `profiles` + Supabase Auth |
| Pedidos | `orders`, `order_items` |
| Engagement | `favorites`, reseñas |
| Operaciones | RLS, policies por taller |
| Media | Supabase Storage + buckets |
| Pagos | Integración externa (no en BD core) |

---

## Cómo crece la plataforma con cientos de talleres

### 1. Onboarding de talleres

Nuevos registros entran en `workshops` con `status = pending`. Tras verificación, pasan a `active` y pueden publicar en `products`.

### 2. Catálogos independientes

Cada taller administra solo sus filas en `products` (filtradas por `workshop_id`). La home y `/talleres` listan workshops; cada uno expone su catálogo sin mezclar inventario.

### 3. Búsqueda y filtros

- Por taller: `products.workshop_id` + índice compuesto.
- Por categoría: `products.category_id` (cross-taller).
- Por ciudad: join `products` → `workshops` filtrando `city`.

### 4. Marcas opcionales

Talleres grandes pueden usar `brands` para sub-líneas; talleres pequeños dejan `brand_id = NULL`.

### 5. Panel administrativo

El panel actual (`/panel`) migrará de `localStorage` a CRUD sobre estas tablas, scoped por `workshop_id` cuando exista auth.

### 6. Rendimiento

Con ~500 talleres y ~5.000 productos:

- Consultas por taller: O(log n) con índices actuales.
- Listados globales: paginación + índices en `status` y `created_at`.
- Si supera ~100k productos: considerar vistas materializadas por taller o read replicas.

---

## Aplicar el schema

**No se ejecuta automáticamente desde la app.**

1. Abrir Supabase → SQL Editor.
2. Pegar el contenido de `supabase/schema.sql`.
3. Ejecutar manualmente.
4. Verificar tablas en Table Editor.

Después (fuera de este schema):

- Seed de categorías y talleres simulados.
- Ajustar `src/lib/supabase/fetch-products.ts` si los nombres de columnas difieren del código Fase A.
- Activar RLS en Sprint posterior.

---

## Relación con el código actual

| Código actual | Tabla destino |
|---------------|---------------|
| `src/data/workshops.ts` | `workshops` |
| `src/data/categories.ts` | `categories` |
| `src/data/products.ts` | `products` + `product_images` + `product_variants` |
| `AdminProduct` (panel) | `products` + variantes + imágenes |
| `Product` (tipo TS) | Join de producto + imágenes + variantes + taller + categoría |

---

*Schema v1 — AtresColombia. Sin datos, sin RLS, sin auth.*
