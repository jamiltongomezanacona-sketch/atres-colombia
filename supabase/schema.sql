-- =============================================================================
-- AtresColombia — schema.sql (v1.1)
-- =============================================================================
-- Plataforma multi-taller / multi-tienda. La entidad principal es `workshops`.
--
-- Incluye: workshops, brands, categories, products, product_images, product_variants
--
-- Cambios respecto a v1:
--   - Columnas alineadas con la app Next.js (available, made_to_order, color_name/value, alt_text)
--   - Trigger brand_id ↔ workshop_id
--   - Trigger sincronizacion products.stock desde variantes
--   - Indices compuestos para escala
--   - Columna search_vector para busqueda full-text
--
-- NO incluye: auth, profiles, orders, pagos, favoritos, RLS.
-- Ejecutar manualmente en el SQL Editor de Supabase o via CLI cuando corresponda.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Extensiones
-- -----------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- Funcion reutilizable: actualizar updated_at
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.set_updated_at IS
  'Trigger function que asigna updated_at = now() en cada UPDATE.';

-- -----------------------------------------------------------------------------
-- Validar que brand_id pertenezca al mismo workshop del producto
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.validate_product_brand_workshop()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.brand_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1
      FROM public.brands b
      WHERE b.id = NEW.brand_id
        AND b.workshop_id = NEW.workshop_id
    ) THEN
      RAISE EXCEPTION
        'brand_id % no pertenece al workshop_id % del producto',
        NEW.brand_id,
        NEW.workshop_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.validate_product_brand_workshop IS
  'Impide asociar una marca de otro taller al producto.';

-- -----------------------------------------------------------------------------
-- Sincronizar stock agregado del producto desde sus variantes
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.sync_product_stock_from_variants()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  target_product_id UUID;
BEGIN
  target_product_id := COALESCE(NEW.product_id, OLD.product_id);

  UPDATE public.products p
  SET stock = COALESCE(
    (
      SELECT SUM(v.stock)
      FROM public.product_variants v
      WHERE v.product_id = target_product_id
    ),
    0
  )
  WHERE p.id = target_product_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

COMMENT ON FUNCTION public.sync_product_stock_from_variants IS
  'Mantiene products.stock como suma de product_variants.stock (fuente de verdad: variantes).';

-- -----------------------------------------------------------------------------
-- Actualizar search_vector en products
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.products_search_vector_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('spanish', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('spanish', COALESCE(NEW.short_description, '')), 'B') ||
    setweight(to_tsvector('spanish', COALESCE(NEW.description, '')), 'C');
  RETURN NEW;
END;
$$;

-- =============================================================================
-- TABLA: workshops
-- =============================================================================

CREATE TABLE public.workshops (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                    TEXT        NOT NULL,
  name                    TEXT        NOT NULL,
  description             TEXT        NOT NULL,
  city                    TEXT        NOT NULL,
  department              TEXT        NOT NULL,
  country                 TEXT        NOT NULL DEFAULT 'Colombia',
  logo_url                TEXT,
  cover_url               TEXT,
  phone                   TEXT,
  whatsapp                TEXT,
  email                   TEXT,
  website                 TEXT,
  verified                BOOLEAN     NOT NULL DEFAULT FALSE,
  rating                  NUMERIC(2, 1) NOT NULL DEFAULT 0.0,
  review_count            INTEGER     NOT NULL DEFAULT 0,
  supports_customization  BOOLEAN     NOT NULL DEFAULT FALSE,
  supports_home_trial     BOOLEAN     NOT NULL DEFAULT FALSE,
  production_time         TEXT,
  minimum_order           INTEGER,
  status                  TEXT        NOT NULL DEFAULT 'pending',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT workshops_slug_unique
    UNIQUE (slug),

  CONSTRAINT workshops_slug_format_check
    CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),

  CONSTRAINT workshops_name_not_blank_check
    CHECK (LENGTH(TRIM(name)) > 0),

  CONSTRAINT workshops_rating_range_check
    CHECK (rating >= 0 AND rating <= 5),

  CONSTRAINT workshops_review_count_non_negative_check
    CHECK (review_count >= 0),

  CONSTRAINT workshops_minimum_order_positive_check
    CHECK (minimum_order IS NULL OR minimum_order >= 1),

  CONSTRAINT workshops_status_check
    CHECK (status IN ('active', 'pending', 'inactive')),

  CONSTRAINT workshops_whatsapp_digits_check
    CHECK (whatsapp IS NULL OR whatsapp ~ '^[0-9]+$'),

  CONSTRAINT workshops_email_format_check
    CHECK (
      email IS NULL
      OR email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    )
);

COMMENT ON TABLE public.workshops IS
  'Talleres y tiendas de AtresColombia. Entidad raiz del modelo: cada catalogo pertenece a un workshop.';

CREATE INDEX idx_workshops_status
  ON public.workshops (status);

CREATE INDEX idx_workshops_city
  ON public.workshops (city);

CREATE INDEX idx_workshops_verified_active
  ON public.workshops (verified, status);

CREATE INDEX idx_workshops_active_list
  ON public.workshops (city, rating DESC)
  WHERE status = 'active';

CREATE TRIGGER trg_workshops_set_updated_at
  BEFORE UPDATE ON public.workshops
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- TABLA: brands
-- =============================================================================

CREATE TABLE public.brands (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id  UUID        NOT NULL,
  name         TEXT        NOT NULL,
  slug         TEXT        NOT NULL,
  logo_url     TEXT,
  description  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT brands_workshop_id_fkey
    FOREIGN KEY (workshop_id)
    REFERENCES public.workshops (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT brands_workshop_slug_unique
    UNIQUE (workshop_id, slug),

  CONSTRAINT brands_name_not_blank_check
    CHECK (LENGTH(TRIM(name)) > 0),

  CONSTRAINT brands_slug_format_check
    CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

COMMENT ON TABLE public.brands IS
  'Marcas comerciales opcionales asociadas a un taller.';

CREATE INDEX idx_brands_workshop_id
  ON public.brands (workshop_id);

CREATE TRIGGER trg_brands_set_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- TABLA: categories
-- =============================================================================

CREATE TABLE public.categories (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  slug         TEXT        NOT NULL,
  icon         TEXT,
  description  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT categories_slug_unique
    UNIQUE (slug),

  CONSTRAINT categories_name_not_blank_check
    CHECK (LENGTH(TRIM(name)) > 0),

  CONSTRAINT categories_slug_format_check
    CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

COMMENT ON TABLE public.categories IS
  'Categorias globales de AtresColombia. Compartidas por todos los talleres.';

CREATE INDEX idx_categories_name
  ON public.categories (name);

-- =============================================================================
-- TABLA: products
-- =============================================================================

CREATE TABLE public.products (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id             UUID        NOT NULL,
  brand_id                UUID,
  category_id             UUID        NOT NULL,
  slug                    TEXT        NOT NULL,
  name                    TEXT        NOT NULL,
  short_description       TEXT        NOT NULL,
  description             TEXT        NOT NULL,
  price                   INTEGER     NOT NULL,
  compare_price           INTEGER,
  currency                TEXT        NOT NULL DEFAULT 'COP',
  stock                   INTEGER     NOT NULL DEFAULT 0,
  available               BOOLEAN     NOT NULL DEFAULT TRUE,
  made_to_order           BOOLEAN     NOT NULL DEFAULT FALSE,
  is_new                  BOOLEAN     NOT NULL DEFAULT FALSE,
  material                TEXT,
  care_instructions       TEXT,
  origin                  TEXT,
  rating                  NUMERIC(2, 1) NOT NULL DEFAULT 0.0,
  review_count            INTEGER     NOT NULL DEFAULT 0,
  sold_count              INTEGER     NOT NULL DEFAULT 0,
  status                  TEXT        NOT NULL DEFAULT 'draft',
  featured                BOOLEAN     NOT NULL DEFAULT FALSE,
  supports_customization  BOOLEAN     NOT NULL DEFAULT FALSE,
  supports_home_trial     BOOLEAN     NOT NULL DEFAULT FALSE,
  production_days         INTEGER,
  published_at            TIMESTAMPTZ,
  search_vector           TSVECTOR,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT products_workshop_id_fkey
    FOREIGN KEY (workshop_id)
    REFERENCES public.workshops (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT products_brand_id_fkey
    FOREIGN KEY (brand_id)
    REFERENCES public.brands (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,

  CONSTRAINT products_category_id_fkey
    FOREIGN KEY (category_id)
    REFERENCES public.categories (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT products_slug_unique
    UNIQUE (slug),

  CONSTRAINT products_name_not_blank_check
    CHECK (LENGTH(TRIM(name)) > 0),

  CONSTRAINT products_short_description_not_blank_check
    CHECK (LENGTH(TRIM(short_description)) > 0),

  CONSTRAINT products_price_non_negative_check
    CHECK (price >= 0),

  CONSTRAINT products_compare_price_valid_check
    CHECK (compare_price IS NULL OR compare_price >= price),

  CONSTRAINT products_stock_non_negative_check
    CHECK (stock >= 0),

  CONSTRAINT products_production_days_positive_check
    CHECK (production_days IS NULL OR production_days >= 0),

  CONSTRAINT products_rating_range_check
    CHECK (rating >= 0 AND rating <= 5),

  CONSTRAINT products_review_count_non_negative_check
    CHECK (review_count >= 0),

  CONSTRAINT products_sold_count_non_negative_check
    CHECK (sold_count >= 0),

  CONSTRAINT products_currency_check
    CHECK (currency IN ('COP')),

  CONSTRAINT products_status_check
    CHECK (status IN ('draft', 'active', 'inactive', 'archived'))
);

COMMENT ON TABLE public.products IS
  'Catalogo de productos. Cada fila pertenece a un taller; la categoria es global.';

COMMENT ON COLUMN public.products.short_description IS
  'Resumen para tarjetas de catalogo (mapea a Product.description en la app).';

COMMENT ON COLUMN public.products.description IS
  'Descripcion larga del detalle (mapea a Product.longDescription en la app).';

COMMENT ON COLUMN public.products.compare_price IS
  'Precio anterior tachado en UI (mapea a Product.previousPrice).';

COMMENT ON COLUMN public.products.stock IS
  'Inventario agregado sincronizado desde product_variants via trigger.';

COMMENT ON COLUMN public.products.published_at IS
  'Fecha de publicacion para ordenamiento y paginacion por cursor.';

CREATE INDEX idx_products_workshop_id
  ON public.products (workshop_id);

CREATE INDEX idx_products_category_id
  ON public.products (category_id);

CREATE INDEX idx_products_brand_id
  ON public.products (brand_id)
  WHERE brand_id IS NOT NULL;

CREATE INDEX idx_products_status
  ON public.products (status);

CREATE INDEX idx_products_workshop_status
  ON public.products (workshop_id, status);

CREATE INDEX idx_products_workshop_active_created
  ON public.products (workshop_id, created_at DESC)
  WHERE status = 'active';

CREATE INDEX idx_products_category_status
  ON public.products (category_id, status);

CREATE INDEX idx_products_status_created
  ON public.products (status, created_at DESC);

CREATE INDEX idx_products_featured_active
  ON public.products (featured, status)
  WHERE status = 'active';

CREATE INDEX idx_products_price
  ON public.products (price);

CREATE INDEX idx_products_search
  ON public.products USING GIN (search_vector);

CREATE TRIGGER trg_products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_products_search_vector_update
  BEFORE INSERT OR UPDATE OF name, short_description, description
  ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.products_search_vector_update();

CREATE TRIGGER trg_products_validate_brand_workshop
  BEFORE INSERT OR UPDATE OF brand_id, workshop_id
  ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_product_brand_workshop();

-- =============================================================================
-- TABLA: product_images
-- =============================================================================

CREATE TABLE public.product_images (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID        NOT NULL,
  image_url    TEXT        NOT NULL,
  alt_text     TEXT,
  sort_order   INTEGER     NOT NULL DEFAULT 0,
  is_cover     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT product_images_product_id_fkey
    FOREIGN KEY (product_id)
    REFERENCES public.products (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT product_images_image_url_not_blank_check
    CHECK (LENGTH(TRIM(image_url)) > 0),

  CONSTRAINT product_images_sort_order_non_negative_check
    CHECK (sort_order >= 0)
);

COMMENT ON TABLE public.product_images IS
  'Imagenes del producto ordenadas para galeria, miniaturas y zoom en detalle.';

COMMENT ON COLUMN public.product_images.image_url IS
  'URL publica o path en Storage (mapea a ProductImage.url en la app).';

CREATE INDEX idx_product_images_product_id
  ON public.product_images (product_id);

CREATE INDEX idx_product_images_product_sort
  ON public.product_images (product_id, sort_order);

CREATE UNIQUE INDEX uq_product_images_one_cover_per_product
  ON public.product_images (product_id)
  WHERE is_cover = TRUE;

-- =============================================================================
-- TABLA: product_variants
-- =============================================================================

CREATE TABLE public.product_variants (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID        NOT NULL,
  color_name   TEXT        NOT NULL,
  color_value  TEXT        NOT NULL DEFAULT '#111111',
  size         TEXT        NOT NULL,
  sku          TEXT,
  stock        INTEGER     NOT NULL DEFAULT 0,
  price        INTEGER,
  available    BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT product_variants_product_id_fkey
    FOREIGN KEY (product_id)
    REFERENCES public.products (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT product_variants_color_name_not_blank_check
    CHECK (LENGTH(TRIM(color_name)) > 0),

  CONSTRAINT product_variants_color_value_format_check
    CHECK (color_value ~ '^#[0-9A-Fa-f]{6}$'),

  CONSTRAINT product_variants_size_not_blank_check
    CHECK (LENGTH(TRIM(size)) > 0),

  CONSTRAINT product_variants_stock_non_negative_check
    CHECK (stock >= 0),

  CONSTRAINT product_variants_price_non_negative_check
    CHECK (price IS NULL OR price >= 0),

  CONSTRAINT product_variants_product_color_size_unique
    UNIQUE (product_id, color_name, size)
);

COMMENT ON TABLE public.product_variants IS
  'Combinaciones color/talla con inventario. Fuente de verdad del stock.';

COMMENT ON COLUMN public.product_variants.color_name IS
  'Nombre comercial del color, ej. Verde bosque, Negro.';

COMMENT ON COLUMN public.product_variants.color_value IS
  'Valor hex para selector visual en UI, ej. #2D5016.';

CREATE INDEX idx_product_variants_product_id
  ON public.product_variants (product_id);

CREATE INDEX idx_product_variants_sku
  ON public.product_variants (sku)
  WHERE sku IS NOT NULL;

CREATE INDEX idx_product_variants_stock
  ON public.product_variants (product_id, stock);

CREATE TRIGGER trg_product_variants_sync_stock
  AFTER INSERT OR UPDATE OF stock OR DELETE
  ON public.product_variants
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_product_stock_from_variants();

-- =============================================================================
-- Fin del schema v1.1
-- =============================================================================
