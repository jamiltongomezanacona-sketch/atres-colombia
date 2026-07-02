-- =============================================================================
-- AtresColombia — rls.sql (MVP)
-- =============================================================================
-- Row Level Security: lectura publica del catalogo.
--
-- Ejecutar en Supabase SQL Editor DESPUES de schema.sql y seed.sql.
--
-- Incluye:
--   - RLS habilitado en workshops, products, categories, product_images,
--     product_variants
--   - Policies SELECT para roles anon y authenticated
--   - Sin policies INSERT / UPDATE / DELETE (fase posterior)
--
-- Reglas:
--   workshops  → solo status = 'active'
--   products   → solo status = 'active'
--   demas tablas → solo registros vinculados a productos activos
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. Habilitar RLS
-- -----------------------------------------------------------------------------

ALTER TABLE public.workshops        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 2. Grants de lectura (idempotente; Supabase suele tenerlos, se reafirman)
-- -----------------------------------------------------------------------------

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON public.workshops        TO anon, authenticated;
GRANT SELECT ON public.products         TO anon, authenticated;
GRANT SELECT ON public.categories       TO anon, authenticated;
GRANT SELECT ON public.product_images   TO anon, authenticated;
GRANT SELECT ON public.product_variants TO anon, authenticated;

-- -----------------------------------------------------------------------------
-- 3. Eliminar policies previas (re-ejecucion segura)
-- -----------------------------------------------------------------------------

DROP POLICY IF EXISTS "anon_authenticated_select_active_workshops"
  ON public.workshops;

DROP POLICY IF EXISTS "anon_authenticated_select_active_products"
  ON public.products;

DROP POLICY IF EXISTS "anon_authenticated_select_categories_of_active_products"
  ON public.categories;

DROP POLICY IF EXISTS "anon_authenticated_select_images_of_active_products"
  ON public.product_images;

DROP POLICY IF EXISTS "anon_authenticated_select_variants_of_active_products"
  ON public.product_variants;

-- -----------------------------------------------------------------------------
-- 4. Policies SELECT — workshops
-- -----------------------------------------------------------------------------

CREATE POLICY "anon_authenticated_select_active_workshops"
  ON public.workshops
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

COMMENT ON POLICY "anon_authenticated_select_active_workshops"
  ON public.workshops IS
  'Lectura publica de talleres activos para catalogo y listados.';

-- -----------------------------------------------------------------------------
-- 5. Policies SELECT — products
-- -----------------------------------------------------------------------------

CREATE POLICY "anon_authenticated_select_active_products"
  ON public.products
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

COMMENT ON POLICY "anon_authenticated_select_active_products"
  ON public.products IS
  'Lectura publica de productos activos para ficha y listados.';

-- -----------------------------------------------------------------------------
-- 6. Policies SELECT — categories (solo las usadas por productos activos)
-- -----------------------------------------------------------------------------

CREATE POLICY "anon_authenticated_select_categories_of_active_products"
  ON public.categories
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.products p
      WHERE p.category_id = categories.id
        AND p.status = 'active'
    )
  );

COMMENT ON POLICY "anon_authenticated_select_categories_of_active_products"
  ON public.categories IS
  'Solo categorias referenciadas por al menos un producto activo.';

-- -----------------------------------------------------------------------------
-- 7. Policies SELECT — product_images (solo de productos activos)
-- -----------------------------------------------------------------------------

CREATE POLICY "anon_authenticated_select_images_of_active_products"
  ON public.product_images
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.products p
      WHERE p.id = product_images.product_id
        AND p.status = 'active'
    )
  );

COMMENT ON POLICY "anon_authenticated_select_images_of_active_products"
  ON public.product_images IS
  'Galeria visible solo para productos con status active.';

-- -----------------------------------------------------------------------------
-- 8. Policies SELECT — product_variants (solo de productos activos)
-- -----------------------------------------------------------------------------

CREATE POLICY "anon_authenticated_select_variants_of_active_products"
  ON public.product_variants
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.products p
      WHERE p.id = product_variants.product_id
        AND p.status = 'active'
    )
  );

COMMENT ON POLICY "anon_authenticated_select_variants_of_active_products"
  ON public.product_variants IS
  'Variantes visibles solo para productos con status active.';

COMMIT;

-- =============================================================================
-- 9. Consultas de prueba — simular rol anon
-- =============================================================================
-- El SQL Editor ejecuta como postgres y omite RLS por defecto.
-- SET ROLE anon fuerza las mismas restricciones que la app con publishable key.
-- =============================================================================

BEGIN;

SET LOCAL ROLE anon;

SELECT count(*) AS workshops_visibles_anon
FROM public.workshops;

SELECT count(*) AS products_visibles_anon
FROM public.products;

-- Opcional: verificar tablas relacionadas
SELECT count(*) AS categories_visibles_anon
FROM public.categories;

SELECT count(*) AS product_images_visibles_anon
FROM public.product_images;

SELECT count(*) AS product_variants_visibles_anon
FROM public.product_variants;

RESET ROLE;

COMMIT;

-- =============================================================================
-- Resultado esperado tras seed.sql (valores de referencia):
--   workshops_visibles_anon        → 5
--   products_visibles_anon         → 30
--   categories_visibles_anon       → 7
--   product_images_visibles_anon   → 90
--   product_variants_visibles_anon → 90
-- =============================================================================
