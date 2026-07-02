-- =============================================================================
-- AtresColombia — schema.sql (v1)
-- =============================================================================
-- Plataforma multi-taller / multi-tienda. La entidad principal es `workshops`.
--
-- Incluye: workshops, brands, categories, products, product_images, product_variants
--
-- NO incluye en esta versión: auth, profiles, orders, pagos, favoritos, RLS.
-- Ejecutar manualmente en el SQL Editor de Supabase o via CLI cuando corresponda.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Extensiones
-- -----------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- Función reutilizable: actualizar updated_at
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

-- =============================================================================
-- TABLA: workshops
-- =============================================================================
-- Talleres y tiendas verificadas. Cada punto de confección es dueño de su catálogo.
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
  'Talleres y tiendas de AtresColombia. Entidad raíz del modelo: cada catálogo pertenece a un workshop.';

COMMENT ON COLUMN public.workshops.slug IS
  'Identificador legible para URLs publicas, ej. atres-colombia, confecciones-soacha.';

COMMENT ON COLUMN public.workshops.verified IS
  'Indica si el taller fue verificado por la plataforma (Taller/Tienda verificada en UI).';

COMMENT ON COLUMN public.workshops.production_time IS
  'Texto comercial del tiempo promedio de confeccion, ej. "5 a 7 dias habiles".';

COMMENT ON COLUMN public.workshops.status IS
  'Estado operativo: active (visible), pending (onboarding), inactive (oculto).';

CREATE INDEX idx_workshops_status
  ON public.workshops (status);

CREATE INDEX idx_workshops_city
  ON public.workshops (city);

CREATE INDEX idx_workshops_verified_active
  ON public.workshops (verified, status);

CREATE TRIGGER trg_workshops_set_updated_at
  BEFORE UPDATE ON public.workshops
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- TABLA: brands
-- =============================================================================
-- Marcas opcionales dentro de un taller. Un workshop puede tener cero o muchas.
-- =============================================================================

CREATE TABLE public.brands (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id  UUID        NOT NULL,
  name         TEXT        NOT NULL,
  slug         TEXT        NOT NULL,
  logo_url     TEXT,
  description  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

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
  'Marcas comerciales opcionales asociadas a un taller. No todas las tiendas necesitan marca propia.';

COMMENT ON COLUMN public.brands.workshop_id IS
  'Taller dueno de la marca. Si se elimina el taller, sus marcas se eliminan en cascada.';

CREATE INDEX idx_brands_workshop_id
  ON public.brands (workshop_id);

-- =============================================================================
-- TABLA: categories
-- =============================================================================
-- Taxonomia global de la plataforma (Chaquetas, Camisas, Calzado, etc.).
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

COMMENT ON COLUMN public.categories.icon IS
  'Nombre o ruta de icono para UI (Lucide, emoji codificado o asset URL).';

COMMENT ON COLUMN public.categories.slug IS
  'Slug estable para filtros y URLs, ej. chaquetas, calzado.';

CREATE INDEX idx_categories_name
  ON public.categories (name);

-- =============================================================================
-- TABLA: products
-- =============================================================================
-- Prendas y articulos publicados por un taller. Pueden tener marca opcional.
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
  status                  TEXT        NOT NULL DEFAULT 'draft',
  featured                BOOLEAN     NOT NULL DEFAULT FALSE,
  supports_customization  BOOLEAN     NOT NULL DEFAULT FALSE,
  supports_home_trial     BOOLEAN     NOT NULL DEFAULT FALSE,
  production_days         INTEGER,
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

  CONSTRAINT products_currency_check
    CHECK (currency IN ('COP')),

  CONSTRAINT products_status_check
    CHECK (status IN ('draft', 'active', 'inactive', 'archived'))
);

COMMENT ON TABLE public.products IS
  'Catalogo de productos. Cada fila pertenece a un taller; la categoria es global.';

COMMENT ON COLUMN public.products.workshop_id IS
  'Taller que fabrica y vende el producto. RESTRICT al borrar: no se puede eliminar un taller con productos.';

COMMENT ON COLUMN public.products.brand_id IS
  'Marca opcional del producto dentro del taller. NULL si no aplica.';

COMMENT ON COLUMN public.products.short_description IS
  'Resumen para tarjetas de catalogo y listados verticales.';

COMMENT ON COLUMN public.products.compare_price IS
  'Precio anterior tachado en UI. Debe ser mayor o igual al precio actual.';

COMMENT ON COLUMN public.products.stock IS
  'Inventario agregado a nivel producto. Las variantes pueden tener stock detallado.';

COMMENT ON COLUMN public.products.status IS
  'draft = borrador; active = visible; inactive = oculto; archived = historico.';

COMMENT ON COLUMN public.products.production_days IS
  'Dias estimados de confeccion cuando aplica fabricacion bajo pedido.';

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

CREATE INDEX idx_products_featured_active
  ON public.products (featured, status)
  WHERE status = 'active';

CREATE INDEX idx_products_price
  ON public.products (price);

CREATE TRIGGER trg_products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- TABLA: product_images
-- =============================================================================
-- Galeria de imagenes por producto. Una puede marcarse como portada.
-- =============================================================================

CREATE TABLE public.product_images (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID        NOT NULL,
  image_url    TEXT        NOT NULL,
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

COMMENT ON COLUMN public.product_images.sort_order IS
  'Orden ascendente de visualizacion en galeria (0 = primera).';

COMMENT ON COLUMN public.product_images.is_cover IS
  'Marca la imagen principal del producto en listados y tarjetas.';

CREATE INDEX idx_product_images_product_id
  ON public.product_images (product_id);

CREATE INDEX idx_product_images_product_sort
  ON public.product_images (product_id, sort_order);

-- Solo una portada por producto
CREATE UNIQUE INDEX uq_product_images_one_cover_per_product
  ON public.product_images (product_id)
  WHERE is_cover = TRUE;

-- =============================================================================
-- TABLA: product_variants
-- =============================================================================
-- Variantes por color y talla. Permite stock y precio por combinacion.
-- =============================================================================

CREATE TABLE public.product_variants (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID        NOT NULL,
  color        TEXT        NOT NULL,
  size         TEXT        NOT NULL,
  sku          TEXT,
  stock        INTEGER     NOT NULL DEFAULT 0,
  price        INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT product_variants_product_id_fkey
    FOREIGN KEY (product_id)
    REFERENCES public.products (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT product_variants_color_not_blank_check
    CHECK (LENGTH(TRIM(color)) > 0),

  CONSTRAINT product_variants_size_not_blank_check
    CHECK (LENGTH(TRIM(size)) > 0),

  CONSTRAINT product_variants_stock_non_negative_check
    CHECK (stock >= 0),

  CONSTRAINT product_variants_price_non_negative_check
    CHECK (price IS NULL OR price >= 0),

  CONSTRAINT product_variants_product_color_size_unique
    UNIQUE (product_id, color, size)
);

COMMENT ON TABLE public.product_variants IS
  'Combinaciones color/talla de un producto con inventario y precio opcional por variante.';

COMMENT ON COLUMN public.product_variants.color IS
  'Nombre comercial del color, ej. Verde bosque, Negro.';

COMMENT ON COLUMN public.product_variants.size IS
  'Talla o medida, ej. S, M, L, 38, 40.';

COMMENT ON COLUMN public.product_variants.price IS
  'Precio especifico de la variante. NULL hereda products.price.';

COMMENT ON COLUMN public.product_variants.sku IS
  'Codigo interno del taller para inventario.';

CREATE INDEX idx_product_variants_product_id
  ON public.product_variants (product_id);

CREATE INDEX idx_product_variants_sku
  ON public.product_variants (sku)
  WHERE sku IS NOT NULL;

CREATE INDEX idx_product_variants_stock
  ON public.product_variants (product_id, stock);

-- =============================================================================
-- Fin del schema v1
-- =============================================================================
