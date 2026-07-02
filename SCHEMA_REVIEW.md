# SCHEMA_REVIEW.md — Revisión de `supabase/schema.sql`

**Fecha de revisión:** 2026  
**Alcance:** `workshops`, `brands`, `categories`, `products`, `product_images`, `product_variants`  
**Contexto:** Marketplace de moda colombiano centrado en **talleres**, no en marcas globales.  
**Acción tomada (v1):** Solo análisis. **No se ejecutó SQL.**  
**Actualización v1.1:** Correcciones prioritarias implementadas en `schema.sql`, `seed.sql` y código Supabase.

> **Estado:** Los puntos críticos de desalineación app/schema, stock, brand↔workshop, índices y paginación fueron abordados en **schema v1.1**. Pendiente antes de producción: **RLS** y slug scoped por taller (evaluación futura).

---

## Resumen ejecutivo

El schema v1 es una **base sólida para MVP y primeros cientos de talleres**. Está bien normalizado en lo esencial, documentado con comentarios SQL y protegido con CHECK constraints razonables. Para escalar a **miles de talleres** y **millones de productos**, requerirá ajustes de índices, consistencia de nombres, reglas de integridad entre stock agregado/variantes, alineación con la app Next.js existente y estrategias de lectura (paginación, vistas, partición opcional).

**Veredicto:** ✅ Apto para ejecutar en staging/desarrollo. ⚠️ Requiere cambios planificados antes de producción a escala.

---

## ✔ Fortalezas

### Arquitectura centrada en talleres

- `workshops` como entidad raíz encaja con el modelo de negocio (catálogo por taller, carrito agrupado, WhatsApp por taller).
- `brand_id` nullable evita forzar marcas cuando el marketplace no gira en torno a ellas.
- `categories` global evita duplicar taxonomía en cada taller.

### Normalización (3FN en lo esencial)

- Sin repetición de categorías ni imágenes en filas de producto.
- Variantes en tabla propia (`product_variants`) separadas del producto padre.
- Imágenes en tabla propia (`product_images`) con orden y portada.
- Marcas scoped por `workshop_id` con `UNIQUE (workshop_id, slug)`.

### Integridad referencial

| Relación | ON DELETE | Evaluación |
|----------|-----------|------------|
| `products` → `workshops` | RESTRICT | ✅ Protege catálogo histórico |
| `products` → `categories` | RESTRICT | ✅ Evita borrar categorías en uso |
| `products` → `brands` | SET NULL | ✅ Marca opcional |
| `product_images` / `product_variants` → `products` | CASCADE | ✅ Limpieza automática |

### Constraints y validación

- Slugs con regex consistente en workshops, brands, categories.
- Rangos en `rating`, `review_count`, precios no negativos.
- `compare_price >= price` coherente con UI de descuentos.
- Estados acotados por CHECK (`workshop.status`, `products.status`).
- Índice único parcial: **una sola portada** por producto (`is_cover = TRUE`).

### Índices útiles para el MVP

- `(workshop_id, status)` en `products` — consulta más frecuente (catálogo por taller).
- `(featured, status) WHERE status = 'active'` — destacados en home.
- `(product_id, sort_order)` en imágenes — galería ordenada.
- `(product_id, color, size)` UNIQUE en variantes — evita duplicados.

### Operabilidad

- `created_at` / `updated_at` con trigger `set_updated_at()` en tablas mutables.
- Comentarios `COMMENT ON` en tablas y columnas clave — buena práctica para equipos.
- Uso de UUID v4 — sin colisiones en inserts distribuidos.

### Escalabilidad inicial (hasta ~500 talleres, ~50k productos)

- PostgreSQL maneja este volumen sin partición.
- Índices B-tree en FKs y slugs son suficientes para lecturas por taller y detalle de producto.
- Modelo preparado para añadir `orders`, `profiles`, RLS en fases posteriores sin rediseño total.

---

## ✔ Debilidades

### 1. Desalineación crítica con el código de la app (Fase A Supabase)

El cliente actual (`src/lib/supabase/fetch-products.ts`) espera columnas **que no existen** en `schema.sql`:

| Código app (esperado) | Schema v1 (real) |
|----------------------|------------------|
| `long_description` | `description` |
| `previous_price` | `compare_price` |
| `discount_label` | *(no existe)* |
| `available`, `made_to_order` | *(no existen)* |
| `stock_level` | *(no existe)* |
| `product_images.url` | `image_url` |
| `product_images.alt_text` | *(no existe)* |
| `product_variants.color_name` / `color_value` | `color` (texto único) |
| `product_variants.available` | *(no existe)* |

**Impacto:** Si se ejecuta `schema.sql` + `seed.sql` y se activan variables Supabase, **la lectura pública fallará o hará fallback a seeds** hasta alinear schema o código.

### 2. Redundancia de stock sin regla de sincronización

- `products.stock` (agregado) y `product_variants.stock` (detalle) pueden **desincronizarse**.
- No hay trigger, constraint ni documento que defina cuál es la fuente de verdad.
- Riesgo de mostrar "En stock" en UI con variantes agotadas.

### 3. Duplicación de flags de servicios

- `supports_customization` y `supports_home_trial` existen en **`workshops`** y en **`products`**.
- Sin regla clara: ¿el producto hereda del taller? ¿puede override?
- Posible inconsistencia operativa en panel admin.

### 4. Slug de producto único global

- `UNIQUE (slug)` en `products` funciona con rutas actuales `/productos/[slug]`.
- Con millones de productos y nombres similares entre talleres, habrá presión de colisiones (`camisa-lino`, `pantalon-negro`).
- Alternativa escalable: `UNIQUE (workshop_id, slug)` + rutas `/talleres/{workshop}/productos/{slug}` (cambio de producto en app).

### 5. `brand_id` sin validación cross-workshop

- Un producto podría apuntar a una marca de **otro taller** (FK solo valida existencia, no pertenencia).
- Falta constraint compuesto o trigger: `brand.workshop_id = product.workshop_id`.

### 6. Tipos TEXT para enums de estado

- `status`, `currency` como TEXT + CHECK funciona, pero:
  - No autodocumenta valores en herramientas SQL.
  - Migraciones futuras requieren ALTER CHECK manual.
- En equipos grandes, `CREATE TYPE ... AS ENUM` o tabla `lookup` es más mantenible.

### 7. Campos TEXT libres para datos estructurados

- `product_variants.color` como texto libre impide:
  - Selector visual con hex (`color_value`).
  - Filtros por color normalizados.
  - Imagen asociada por color (como en la app actual).
- `product_variants.size` sin tabla de tallas estándar — difícil guía de tallas consistente.

### 8. Rating denormalizado sin tabla de reseñas

- `workshops.rating` y `review_count` en workshops; productos no tienen rating en schema v1 (pero la app sí lo simula).
- Sin tabla `reviews`, los agregados pueden quedar obsoletos o ser manipulados manualmente.

### 9. Índices insuficientes para escala millones

Faltan índices compuestos orientados a listados globales:

- `(status, created_at DESC)` en `products` — feed / novedades.
- `(category_id, status)` — browse por categoría cross-taller.
- `(workshop_id, category_id, status)` — filtros del catálogo por taller.
- Búsqueda full-text no contemplada (`name`, `short_description`).

### 10. Sin paginación implícita en diseño

- El schema no incluye campos de cursor (`published_at`, `sort_key`).
- Con millones de filas, `ORDER BY created_at` + offset pagina mal; conviene keyset pagination.

### 11. URLs de media en TEXT plano

- `logo_url`, `cover_url`, `image_url` almacenan paths/URLs sin bucket, path relativo vs absoluto, ni CDN.
- Sin tabla de assets, migrar a Supabase Storage será manual.

### 12. `brands` sin `updated_at` ni `status`

- Marcas no pueden archivarse sin borrarlas.
- Sin auditoría de cambios.

### 13. `categories` sin jerarquía

- Solo categorías planas. Moda real suele necesitar subcategorías (Calzado → Mocasines).
- A escala, una columna `parent_id` o tabla `category_closure` evitará rediseño.

### 14. Moneda rígida

- `CHECK (currency IN ('COP'))` — correcto para Colombia hoy.
- Si hay talleres fronterizos o exportación, requerirá migración.

---

## ✔ Mejoras recomendadas

### Prioridad alta (pre-producción)

1. **Alinear schema ↔ app** — Una sola fuente de verdad de nombres de columnas antes de activar Supabase en Vercel (ver sección crítica abajo).

2. **Constraint brand-workshop:**
   ```sql
   -- Ejemplo conceptual (v2)
   -- TRIGGER o FK compuesta vía validación:
   -- products.brand_id debe pertenecer al mismo workshop_id
   ```

3. **Definir fuente de verdad de stock:**
   - Opción A: eliminar `products.stock` y calcular `SUM(variants.stock)`.
   - Opción B: trigger que sincronice agregado al cambiar variantes.
   - Documentar en DATABASE.md.

4. **Índice compuesto para catálogo por taller:**
   ```sql
   CREATE INDEX idx_products_workshop_active_created
     ON products (workshop_id, created_at DESC)
     WHERE status = 'active';
   ```

5. **Slug por taller (evaluar):**
   ```sql
   UNIQUE (workshop_id, slug)  -- en lugar de slug global
   ```
   Requiere cambio de rutas en Next.js — planificar en Sprint futuro.

### Prioridad media (escala: miles de talleres)

6. **Separar color en variantes:**
   ```text
   color_name TEXT
   color_value TEXT  -- hex
   color_sort SMALLINT
   ```

7. **Campos de publicación en products:**
   ```text
   published_at TIMESTAMPTZ
   available BOOLEAN NOT NULL DEFAULT TRUE
   made_to_order BOOLEAN NOT NULL DEFAULT FALSE
   ```

8. **Full-text search:**
   ```sql
   ALTER TABLE products ADD COLUMN search_vector tsvector;
   CREATE INDEX idx_products_search ON products USING GIN (search_vector);
   -- + trigger to_tsvector(name || ' ' || short_description)
   ```

9. **Partial indexes adicionales:**
   ```sql
   CREATE INDEX idx_workshops_active_list
     ON workshops (city, rating DESC)
     WHERE status = 'active';
   ```

10. **Tabla `workshop_categories` (opcional):** relación N:M si un taller no vende todas las categorías globales (hoy `category_slugs[]` existía en seeds TS pero no en schema SQL).

11. **ENUM types nativos** para `products.status`, `workshops.status`.

12. **`sku` UNIQUE por workshop** (no global):
    ```sql
    UNIQUE (workshop_id, sku)  -- vía join o columna denormalizada workshop_id en variants
    ```

### Prioridad baja (millones de productos / infra avanzada)

13. **Particionamiento de `products` por `workshop_id` hash/range** — solo si supera ~10–20M filas y queries siempre filtran por taller.

14. **Read replicas + cache (Redis/CDN)** para listados calientes — capa de aplicación, no schema.

15. **Materialized views** por taller:
    ```sql
    -- product_count, avg_price, active_count por workshop
    REFRESH MATERIALIZED VIEW CONCURRENTLY workshop_catalog_stats;
    ```

16. **Archivado en cold storage** — productos `archived` movidos a `products_archive` para mantener tabla principal pequeña.

17. **Jerarquía de categorías** con `parent_id` y path materializado (`ltree` o `slug_path`).

---

## ✔ Cambios críticos antes de producción

Estos puntos deben resolverse **antes** de considerar el schema “production-ready” con la app actual:

### 🔴 Crítico 1 — Desalineación schema / código / seed

| Artefacto | Estado |
|-----------|--------|
| `schema.sql` | `short_description`, `compare_price`, `image_url`, `color` |
| `seed.sql` | Alineado con schema v1 ✅ |
| `fetch-products.ts` | Espera columnas del SUPABASE_PLAN anterior ❌ |

**Acción requerida (elegir una):**
- **A)** Migrar schema v1 → nombres que espera la app (`long_description`, `previous_price`, etc.), **o**
- **B)** Actualizar `fetch-products.ts` + `map-product.ts` al schema v1 oficial, **o**
- **C)** Crear **vista SQL** `public.products_catalog` que exponga columnas con alias legacy.

Hasta resolver esto, **no activar Supabase en producción** salvo para pruebas aisladas.

### 🔴 Crítico 2 — RLS obligatorio en Supabase público

El schema no incluye RLS (correcto para v1). En producción con anon key:

- Cualquiera con la clave pública podría **INSERT/UPDATE/DELETE** si no hay policies.
- **Antes de producción:** habilitar RLS en todas las tablas + policy `SELECT` pública solo para filas activas + escritura solo `service_role` o usuarios autenticados.

### 🔴 Crítico 3 — Política de borrado de talleres

`ON DELETE RESTRICT` en `products.workshop_id` impide eliminar talleres con catálogo. Definir flujo:

- Soft delete (`status = inactive`) vs hard delete.
- Proceso de offboarding documentado.

### 🟠 Crítico 4 — Integridad marca ↔ taller

Sin validación, datos corruptos en panel admin. Añadir trigger antes de abrir escritura pública.

### 🟠 Crítico 5 — Estrategia de imágenes

`image_url` con paths relativos (`/placeholders/...`) **no funcionan** en Supabase sin dominio de la app. En producción:

- Supabase Storage + URL pública o signed URLs.
- Convención: `storage_path` + bucket name.

### 🟠 Crítico 6 — Paginación obligatoria en queries

`fetchProductsFromSupabase()` actual hace `SELECT` sin `LIMIT`. Con miles/millones de productos:

- Timeout en build SSG.
- Memoria excesiva en Next.js.

Implementar `.range()` / cursor antes de escala.

### 🟠 Crítico 7 — Índice único global de slug bajo presión

Con muchos talleres, colisiones de slug serán frecuentes. Definir estrategia de generación (suffix automático) o migrar a slug scoped por taller.

---

## Evaluación por criterio

| Criterio | Nota | Comentario |
|----------|------|------------|
| **Normalización** | 8/10 | Bien en core; redundancia stock y flags servicios |
| **Índices** | 7/10 | Bueno para MVP; falta FTS, paginación, compuestos |
| **Claves foráneas** | 8/10 | Bien elegidas; falta validación brand↔workshop |
| **Nombres consistentes** | 6/10 | Inconsistencia interna y vs app (`description` vs `short/long`) |
| **Escalabilidad talleres** | 8/10 | Miles OK con índices actuales + paginación |
| **Escalabilidad productos** | 6/10 | Millones requieren FTS, paginación, posible partición |
| **Rendimiento lectura** | 7/10 | Catálogo por taller optimizado; browse global no |
| **Rendimiento escritura** | 7/10 | Triggers mínimos; batch insert seed OK |
| **Seguridad** | 3/10 | Sin RLS — inaceptable en prod con anon key |
| **Alineación marketplace moda** | 8/10 | Taller-centric correcto; variantes/color mejorables |

---

## Proyección de volumen

| Escala | Talleres | Productos | Variantes | ¿Schema v1 suficiente? |
|--------|----------|-----------|-----------|-------------------------|
| MVP | 5–50 | 500–5k | 5k–50k | ✅ Sí |
| Crecimiento | 500–2k | 50k–500k | 500k–5M | ⚠️ Con índices + paginación + FTS |
| Escala alta | 5k+ | 1M–10M+ | 10M–100M+ | ❌ Requiere partición, archivado, cache, read replicas |

Estimación de tamaño (orden de magnitud):

- 1M productos × ~500 bytes/fila ≈ **500 MB** solo en `products` (sin JSON, sin TOAST).
- 10M variantes × ~200 bytes ≈ **2 GB**.
- Índices ≈ **30–50%** adicional.

PostgreSQL en Supabase Pro aguanta esto; el cuello de botella será **queries mal paginadas** y **joins profundos** en listados globales.

---

## Checklist antes de ejecutar `schema.sql` en Supabase

- [ ] Decidir alineación schema ↔ app (Crítico 1)
- [ ] Confirmar que `seed.sql` es solo para entorno dev/staging
- [ ] Planificar script RLS v2 (no ejecutar aún si se acordó no incluirlo)
- [ ] Documentar fuente de verdad de stock
- [ ] Verificar plan Supabase (conexiones, storage, backups)
- [ ] Ejecutar primero en proyecto **staging**, no production
- [ ] Tras seed, probar una query manual equivalente a `fetch-products.ts`
- [ ] Medir tiempo de `SELECT` catálogo por taller con EXPLAIN ANALYZE

---

## Conclusión

`schema.sql` v1 es un **punto de partida profesional** para un marketplace de moda por talleres: normalizado, documentado y con integridad referencial sensata. **No debe ejecutarse en producción con la app actual sin resolver la desalineación de columnas con el código Fase A** y sin un plan de RLS.

**Recomendación:** Ejecutar en **staging**, corregir alineación app/schema, añadir índices compuestos y reglas de stock, luego schema v1.1 antes de producción.

---

*Revisión estática del archivo `supabase/schema.sql`. No se ejecutó SQL ni se modificó código de aplicación.*
