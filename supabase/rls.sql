-- =============================================================================
-- AtresColombia — rls.sql (MVP)
-- =============================================================================
-- Row Level Security: lectura publica del catalogo.
--
-- Ejecutar en Supabase SQL Editor DESPUES de schema.sql y seed.sql.
--
-- Tablas: workshops, products, categories, product_images, product_variants, brands
-- Roles:  anon, authenticated
-- Solo SELECT publico. Sin INSERT / UPDATE / DELETE.
--
-- Reglas:
--   workshops → status = 'active' (si existe la columna; si no, lectura total)
--   products  → status = 'active' (si existe la columna; si no, lectura total)
--   demas     → lectura publica completa
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. Habilitar RLS (idempotente)
-- -----------------------------------------------------------------------------

ALTER TABLE public.workshops        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands           ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 2. Grants de lectura
-- -----------------------------------------------------------------------------

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON public.workshops        TO anon, authenticated;
GRANT SELECT ON public.products         TO anon, authenticated;
GRANT SELECT ON public.categories       TO anon, authenticated;
GRANT SELECT ON public.product_images   TO anon, authenticated;
GRANT SELECT ON public.product_variants TO anon, authenticated;
GRANT SELECT ON public.brands           TO anon, authenticated;

-- -----------------------------------------------------------------------------
-- 3. Eliminar policies previas (re-ejecucion segura)
-- -----------------------------------------------------------------------------

DROP POLICY IF EXISTS "anon_authenticated_select_workshops"
  ON public.workshops;
DROP POLICY IF EXISTS "anon_authenticated_select_active_workshops"
  ON public.workshops;

DROP POLICY IF EXISTS "anon_authenticated_select_products"
  ON public.products;
DROP POLICY IF EXISTS "anon_authenticated_select_active_products"
  ON public.products;

DROP POLICY IF EXISTS "anon_authenticated_select_categories"
  ON public.categories;
DROP POLICY IF EXISTS "anon_authenticated_select_categories_of_active_products"
  ON public.categories;

DROP POLICY IF EXISTS "anon_authenticated_select_product_images"
  ON public.product_images;
DROP POLICY IF EXISTS "anon_authenticated_select_images_of_active_products"
  ON public.product_images;

DROP POLICY IF EXISTS "anon_authenticated_select_product_variants"
  ON public.product_variants;
DROP POLICY IF EXISTS "anon_authenticated_select_variants_of_active_products"
  ON public.product_variants;

DROP POLICY IF EXISTS "anon_authenticated_select_brands"
  ON public.brands;

-- -----------------------------------------------------------------------------
-- 4. Helper: detectar columna status en una tabla
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public._rls_column_exists(
  p_table  TEXT,
  p_column TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns c
    WHERE c.table_schema = 'public'
      AND c.table_name   = p_table
      AND c.column_name  = p_column
  );
$$;

-- -----------------------------------------------------------------------------
-- 5. Policies SELECT — workshops
-- -----------------------------------------------------------------------------

DO $policy$
BEGIN
  IF public._rls_column_exists('workshops', 'status') THEN
    EXECUTE $sql$
      CREATE POLICY "anon_authenticated_select_workshops"
        ON public.workshops
        FOR SELECT
        TO anon, authenticated
        USING (status = 'active')
    $sql$;
  ELSE
    EXECUTE $sql$
      CREATE POLICY "anon_authenticated_select_workshops"
        ON public.workshops
        FOR SELECT
        TO anon, authenticated
        USING (true)
    $sql$;
  END IF;
END;
$policy$;

-- -----------------------------------------------------------------------------
-- 6. Policies SELECT — products
-- -----------------------------------------------------------------------------

DO $policy$
BEGIN
  IF public._rls_column_exists('products', 'status') THEN
    EXECUTE $sql$
      CREATE POLICY "anon_authenticated_select_products"
        ON public.products
        FOR SELECT
        TO anon, authenticated
        USING (status = 'active')
    $sql$;
  ELSE
    EXECUTE $sql$
      CREATE POLICY "anon_authenticated_select_products"
        ON public.products
        FOR SELECT
        TO anon, authenticated
        USING (true)
    $sql$;
  END IF;
END;
$policy$;

-- -----------------------------------------------------------------------------
-- 7. Policies SELECT — lectura publica completa
-- -----------------------------------------------------------------------------

CREATE POLICY "anon_authenticated_select_categories"
  ON public.categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "anon_authenticated_select_product_images"
  ON public.product_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "anon_authenticated_select_product_variants"
  ON public.product_variants
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "anon_authenticated_select_brands"
  ON public.brands
  FOR SELECT
  TO anon, authenticated
  USING (true);

COMMIT;

-- =============================================================================
-- 8. Consultas de prueba — simular rol anon
-- =============================================================================
-- El SQL Editor corre como postgres y omite RLS por defecto.
-- SET LOCAL ROLE anon aplica las mismas reglas que la publishable key.
-- =============================================================================

BEGIN;

SET LOCAL ROLE anon;

SELECT count(*) FROM public.workshops;
SELECT count(*) FROM public.products;

RESET ROLE;

COMMIT;

-- =============================================================================
-- Resultado esperado tras schema v1.1 + seed.sql:
--   workshops → 5  (solo status = 'active')
--   products  → 30 (solo status = 'active')
-- =============================================================================

-- Limpieza opcional de la funcion auxiliar (descomentar si se desea):
-- DROP FUNCTION IF EXISTS public._rls_column_exists(TEXT, TEXT);
