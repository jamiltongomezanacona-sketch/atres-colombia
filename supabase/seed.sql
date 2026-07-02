-- =============================================================================
-- AtresColombia — seed.sql (v1.1)
-- =============================================================================
-- Datos iniciales de demostracion para plataforma colombiana de moda por talleres.
--
-- Ejecutar UNA SOLA VEZ inmediatamente despues de supabase/schema.sql
-- sobre una base de datos vacia.
--
-- Incluye: 5 workshops, 7 categorias, 30 productos,
--          3 imagenes por producto (90), 3 variantes por producto (90).
--
-- NO incluye: usuarios, pedidos, auth, RLS, marcas (brand_id = NULL).
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- Workshops (5)
-- -----------------------------------------------------------------------------

INSERT INTO public.workshops (
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
) VALUES
  (
    '11111111-1111-4111-8111-111111111101',
    'atres-colombia',
    'AtresColombia',
    'Tienda principal de AtresColombia. Moda urbana confeccionada en taller propio con enfoque en calidad, diseno limpio y venta directa al cliente.',
    'Bogota',
    'Cundinamarca',
    'Colombia',
    '/logo.png',
    '/placeholders/chaqueta-verde.svg',
    '+57 300 123 4567',
    '573001234567',
    'hola@atrescolombia.com',
    'https://atres-colombia.vercel.app',
    TRUE,
    4.9,
    128,
    TRUE,
    TRUE,
    '5 a 7 dias habiles',
    1,
    'active'
  ),
  (
    '11111111-1111-4111-8111-111111111102',
    'confecciones-soacha',
    'Confecciones Soacha',
    'Taller familiar especializado en uniformes escolares, dotaciones y confeccion por pedido para empresas del sur de Bogota.',
    'Soacha',
    'Cundinamarca',
    'Colombia',
    '/placeholders/textura-taller.svg',
    '/placeholders/camisa-lino.svg',
    '+57 300 234 5678',
    '573002345678',
    'contacto@confeccionessoacha.co',
    NULL,
    TRUE,
    4.7,
    86,
    TRUE,
    FALSE,
    '4 a 8 dias habiles',
    5,
    'active'
  ),
  (
    '11111111-1111-4111-8111-111111111103',
    'taller-san-victorino',
    'Taller San Victorino',
    'Confeccion comercial en el corazon de San Victorino. Prendas de oficina y casual con excelente relacion calidad-precio.',
    'Bogota',
    'Cundinamarca',
    'Colombia',
    '/placeholders/textura-taller.svg',
    '/placeholders/chaqueta-negra.svg',
    '+57 300 345 6789',
    '573003456789',
    'ventas@sanvictorino.co',
    NULL,
    TRUE,
    4.6,
    214,
    FALSE,
    FALSE,
    '3 a 6 dias habiles',
    1,
    'active'
  ),
  (
    '11111111-1111-4111-8111-111111111104',
    'moda-restrepo',
    'Moda Restrepo',
    'Tienda de moda femenina en Restrepo. Telas frescas, cortes modernos y produccion en pequeno lote.',
    'Bogota',
    'Cundinamarca',
    'Colombia',
    '/placeholders/camisa-oliva.svg',
    '/placeholders/camisa-oliva.svg',
    '+57 300 456 7890',
    '573004567890',
    'hola@modarestrepo.co',
    NULL,
    TRUE,
    4.8,
    67,
    TRUE,
    TRUE,
    '2 a 5 dias habiles',
    1,
    'active'
  ),
  (
    '11111111-1111-4111-8111-111111111105',
    'calzado-bucaramanga',
    'Calzado Bucaramanga',
    'Taller santandereano de calzado artesanal en cuero. Mocasines, botas y zapatos formales hechos a mano.',
    'Bucaramanga',
    'Santander',
    'Colombia',
    '/placeholders/tenis-cuero.svg',
    '/placeholders/tenis-cuero.svg',
    '+57 300 567 8901',
    '573005678901',
    'pedidos@calzadobucaramanga.co',
    NULL,
    TRUE,
    4.9,
    142,
    TRUE,
    FALSE,
    '5 a 10 dias habiles',
    1,
    'active'
  );

-- -----------------------------------------------------------------------------
-- Categories (7)
-- -----------------------------------------------------------------------------

INSERT INTO public.categories (
  id,
  slug,
  name,
  icon,
  description
) VALUES
  (
    '22222222-2222-4222-8222-222222222201',
    'chaquetas',
    'Chaquetas',
    'coat-hanger',
    'Prendas superiores, abrigos y capas urbanas.'
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    'camisas',
    'Camisas',
    'shirt',
    'Camisas, blusas y tops para uso diario.'
  ),
  (
    '22222222-2222-4222-8222-222222222203',
    'pantalones',
    'Pantalones',
    'rows',
    'Pantalones, faldas y prendas inferiores.'
  ),
  (
    '22222222-2222-4222-8222-222222222204',
    'calzado',
    'Calzado',
    'footprints',
    'Calzado artesanal y urbano hecho en Colombia.'
  ),
  (
    '22222222-2222-4222-8222-222222222205',
    'uniformes',
    'Uniformes',
    'briefcase',
    'Uniformes escolares, dotaciones y ropa de trabajo.'
  ),
  (
    '22222222-2222-4222-8222-222222222206',
    'deportivo',
    'Deportivo',
    'dumbbell',
    'Ropa deportiva y activewear.'
  ),
  (
    '22222222-2222-4222-8222-222222222207',
    'accesorios',
    'Accesorios',
    'gem',
    'Complementos y accesorios de moda.'
  );

-- -----------------------------------------------------------------------------
-- Products (30) — 6 por taller
-- -----------------------------------------------------------------------------

INSERT INTO public.products (
  id,
  workshop_id,
  brand_id,
  category_id,
  slug,
  name,
  short_description,
  description,
  price,
  compare_price,
  currency,
  stock,
  status,
  featured,
  supports_customization,
  supports_home_trial,
  production_days
) VALUES
  -- AtresColombia (6)
  (
    '33333333-3333-4333-8333-333333333301',
    '11111111-1111-4111-8111-111111111101',
    NULL,
    '22222222-2222-4222-8222-222222222201',
    'chaqueta-bogota-verde',
    'Chaqueta Bogota Verde',
    'Chaqueta ligera con corte urbano y acabado resistente.',
    'Prenda versatil para clima templado de la sabana de Bogota. Confeccionada en taller colombiano con bolsillos amplios, cierre frontal y silueta limpia para uso diario.',
    189000,
    229000,
    'COP',
    36,
    'active',
    TRUE,
    TRUE,
    TRUE,
    7
  ),
  (
    '33333333-3333-4333-8333-333333333302',
    '11111111-1111-4111-8111-111111111101',
    NULL,
    '22222222-2222-4222-8222-222222222202',
    'camisa-medellin-lino',
    'Camisa Medellin Lino',
    'Camisa fresca de manga corta con textura natural.',
    'Camisa pensada para dias calidos en el valle de Aburra. Lino mezclado con cuello abierto, caida suave y costuras reforzadas en hombros.',
    119000,
    NULL,
    'COP',
    30,
    'active',
    TRUE,
    FALSE,
    TRUE,
    5
  ),
  (
    '33333333-3333-4333-8333-333333333303',
    '11111111-1111-4111-8111-111111111101',
    NULL,
    '22222222-2222-4222-8222-222222222203',
    'pantalon-cali-recto',
    'Pantalon Cali Recto',
    'Pantalon recto con pretina comoda y tela flexible.',
    'Basico de rotacion diaria con horma recta y mezcla textil que conserva la forma. Ideal para oficina informal y ciudad.',
    154000,
    179000,
    'COP',
    42,
    'active',
    FALSE,
    TRUE,
    FALSE,
    6
  ),
  (
    '33333333-3333-4333-8333-333333333304',
    '11111111-1111-4111-8111-111111111101',
    NULL,
    '22222222-2222-4222-8222-222222222204',
    'tenis-barranquilla-cuero',
    'Tenis Barranquilla Cuero',
    'Tenis de cuero con suela ligera y acabado minimalista.',
    'Calzado casual en cuero colombiano con interior suave y lineas limpias. Inspirado en el estilo costeno urbano.',
    249000,
    NULL,
    'COP',
    24,
    'active',
    TRUE,
    FALSE,
    TRUE,
    4
  ),
  (
    '33333333-3333-4333-8333-333333333305',
    '11111111-1111-4111-8111-111111111101',
    NULL,
    '22222222-2222-4222-8222-222222222206',
    'hoodie-sabana-occidental',
    'Hoodie Sabana Occidental',
    'Buso con capucha en felpa suave para clima frio.',
    'Hoodie oversize en algodon peinado, pensado para noches frias de la sabana. Costuras reforzadas y bolsillo canguro amplio.',
    139000,
    159000,
    'COP',
    33,
    'active',
    FALSE,
    TRUE,
    TRUE,
    5
  ),
  (
    '33333333-3333-4333-8333-333333333306',
    '11111111-1111-4111-8111-111111111101',
    NULL,
    '22222222-2222-4222-8222-222222222207',
    'gorra-cacao-huila',
    'Gorra Cacao Huila',
    'Gorra ajustable con broche metalico y visera curva.',
    'Accesorio unisex en algodon cepillado con bordado discreto. Inspirada en la region cafetera del Huila.',
    45000,
    NULL,
    'COP',
    60,
    'active',
    FALSE,
    TRUE,
    FALSE,
    3
  ),
  -- Confecciones Soacha (6)
  (
    '33333333-3333-4333-8333-333333333307',
    '11111111-1111-4111-8111-111111111102',
    NULL,
    '22222222-2222-4222-8222-222222222205',
    'uniforme-colegio-soacha',
    'Uniforme Colegio Soacha',
    'Uniforme escolar resistente con bordado personalizable.',
    'Conjunto escolar en drill reforzado para colegios de Soacha y sur de Bogota. Incluye opcion de bordado institucional.',
    89000,
    NULL,
    'COP',
    45,
    'active',
    TRUE,
    TRUE,
    FALSE,
    8
  ),
  (
    '33333333-3333-4333-8333-333333333308',
    '11111111-1111-4111-8111-111111111102',
    NULL,
    '22222222-2222-4222-8222-222222222205',
    'dotacion-empresarial-soacha',
    'Dotacion Empresarial Soacha',
    'Camisa y pantalon para dotacion corporativa por pedido.',
    'Set basico de dotacion laboral con costuras reforzadas y tallaje amplio para equipos de trabajo e industria local.',
    135000,
    NULL,
    'COP',
    30,
    'active',
    FALSE,
    TRUE,
    FALSE,
    8
  ),
  (
    '33333333-3333-4333-8333-333333333309',
    '11111111-1111-4111-8111-111111111102',
    NULL,
    '22222222-2222-4222-8222-222222222205',
    'buso-escolar-premium',
    'Buso Escolar Premium',
    'Buso escolar en felpa con cuello redondo reforzado.',
    'Prenda escolar comoda para temporadas de frio en la altiplanicie. Disponible en tonos institucionales.',
    72000,
    NULL,
    'COP',
    54,
    'active',
    FALSE,
    TRUE,
    FALSE,
    6
  ),
  (
    '33333333-3333-4333-8333-333333333310',
    '11111111-1111-4111-8111-111111111102',
    NULL,
    '22222222-2222-4222-8222-222222222205',
    'pantalon-drill-escolar',
    'Pantalon Drill Escolar',
    'Pantalon escolar en drill con refuerzo en rodillas.',
    'Pantalon resistente para uso diario escolar. Tela drill de algodon y poliester con excelente duracion.',
    68000,
    NULL,
    'COP',
    48,
    'active',
    FALSE,
    TRUE,
    FALSE,
    7
  ),
  (
    '33333333-3333-4333-8333-333333333311',
    '11111111-1111-4111-8111-111111111102',
    NULL,
    '22222222-2222-4222-8222-222222222202',
    'camisa-oxford-dotacion',
    'Camisa Oxford Dotacion',
    'Camisa manga larga en oxford para personal administrativo.',
    'Camisa formal en oxford blanco y celeste para empresas. Botones resistentes y cuello clasico.',
    79000,
    NULL,
    'COP',
    36,
    'active',
    FALSE,
    TRUE,
    FALSE,
    5
  ),
  (
    '33333333-3333-4333-8333-333333333312',
    '11111111-1111-4111-8111-111111111102',
    NULL,
    '22222222-2222-4222-8222-222222222205',
    'chaleco-seguridad-industrial',
    'Chaleco Seguridad Industrial',
    'Chaleco reflectivo para cuadrillas y bodegas.',
    'Chaleco de alta visibilidad con cintas reflectivas y cierre frontal. Cumple requerimientos basicos de seguridad industrial.',
    55000,
    NULL,
    'COP',
    72,
    'active',
    FALSE,
    FALSE,
    FALSE,
    4
  ),
  -- Taller San Victorino (6)
  (
    '33333333-3333-4333-8333-333333333313',
    '11111111-1111-4111-8111-111111111103',
    NULL,
    '22222222-2222-4222-8222-222222222201',
    'blazer-urbano-victorino',
    'Blazer Urbano Victorino',
    'Blazer ligero con corte moderno para uso diario.',
    'Prenda confeccionada en San Victorino con acabados comerciales. Ideal para oficina creativa y salidas nocturnas.',
    175000,
    199000,
    'COP',
    27,
    'active',
    TRUE,
    FALSE,
    FALSE,
    6
  ),
  (
    '33333333-3333-4333-8333-333333333314',
    '11111111-1111-4111-8111-111111111103',
    NULL,
    '22222222-2222-4222-8222-222222222202',
    'camisa-ejecutiva-popelin',
    'Camisa Ejecutiva Popelin',
    'Camisa formal en popelin de algodon peinado.',
    'Camisa ejecutiva con cuello clasico y punos ajustables. Tejido popelin fresco para jornadas largas en Bogota.',
    98000,
    NULL,
    'COP',
    39,
    'active',
    FALSE,
    FALSE,
    FALSE,
    4
  ),
  (
    '33333333-3333-4333-8333-333333333315',
    '11111111-1111-4111-8111-111111111103',
    NULL,
    '22222222-2222-4222-8222-222222222203',
    'pantalon-formal-varsovia',
    'Pantalon Formal Varsovia',
    'Pantalon de vestir con pinzas y caida elegante.',
    'Pantalon formal para hombre con corte Varsovia. Ideal para reuniones de trabajo y eventos corporativos.',
    128000,
    NULL,
    'COP',
    33,
    'active',
    FALSE,
    FALSE,
    FALSE,
    5
  ),
  (
    '33333333-3333-4333-8333-333333333316',
    '11111111-1111-4111-8111-111111111103',
    NULL,
    '22222222-2222-4222-8222-222222222201',
    'saco-dama-cintura',
    'Saco Dama Cintura',
    'Saco femenino entallado en la cintura.',
    'Saco elegante para oficina con forro ligero y botones forrados. Corte que realza la silueta sin perder comodidad.',
    165000,
    185000,
    'COP',
    21,
    'active',
    FALSE,
    TRUE,
    FALSE,
    6
  ),
  (
    '33333333-3333-4333-8333-333333333317',
    '11111111-1111-4111-8111-111111111103',
    NULL,
    '22222222-2222-4222-8222-222222222202',
    'vestido-oficina-medio',
    'Vestido Oficina Medio',
    'Vestido midi formal para entorno corporativo.',
    'Vestido de longitud media en tela con excelente caida. Versatil para oficina y eventos de media formalidad.',
    142000,
    NULL,
    'COP',
    18,
    'active',
    FALSE,
    TRUE,
    FALSE,
    7
  ),
  (
    '33333333-3333-4333-8333-333333333318',
    '11111111-1111-4111-8111-111111111103',
    NULL,
    '22222222-2222-4222-8222-222222222207',
    'corbata-seda-paisa',
    'Corbata Seda Paisa',
    'Corbata en seda sintetica con tonos sobrios.',
    'Accesorio formal para completar look ejecutivo. Disponible en vinos, azules y grises oscuros.',
    38000,
    NULL,
    'COP',
    84,
    'active',
    FALSE,
    FALSE,
    FALSE,
    2
  ),
  -- Moda Restrepo (6)
  (
    '33333333-3333-4333-8333-333333333319',
    '11111111-1111-4111-8111-111111111104',
    NULL,
    '22222222-2222-4222-8222-222222222202',
    'blusa-lino-restrepo',
    'Blusa Lino Restrepo',
    'Blusa fresca de lino con caida suave y cuello redondo.',
    'Prenda femenina ideal para clima calido en Bogota. Confeccionada en telas naturales seleccionadas por Moda Restrepo.',
    99000,
    NULL,
    'COP',
    30,
    'active',
    TRUE,
    FALSE,
    TRUE,
    4
  ),
  (
    '33333333-3333-4333-8333-333333333320',
    '11111111-1111-4111-8111-111111111104',
    NULL,
    '22222222-2222-4222-8222-222222222202',
    'vestido-floral-cartagena',
    'Vestido Floral Cartagena',
    'Vestido ligero con estampado floral tropical.',
    'Vestido inspirado en la costa Caribe colombiana. Tela fresca y silueta fluida para dias calurosos.',
    168000,
    189000,
    'COP',
    15,
    'active',
    TRUE,
    TRUE,
    TRUE,
    5
  ),
  (
    '33333333-3333-4333-8333-333333333321',
    '11111111-1111-4111-8111-111111111104',
    NULL,
    '22222222-2222-4222-8222-222222222203',
    'falda-midi-linho',
    'Falda Midi Linho',
    'Falda midi en lino con cintura alta.',
    'Falda versatil para combinar con blusas y camisas. Corte midi atemporal confeccionado en Restrepo.',
    112000,
    NULL,
    'COP',
    24,
    'active',
    FALSE,
    FALSE,
    TRUE,
    4
  ),
  (
    '33333333-3333-4333-8333-333333333322',
    '11111111-1111-4111-8111-111111111104',
    NULL,
    '22222222-2222-4222-8222-222222222202',
    'top-crochet-caribe',
    'Top Crochet Caribe',
    'Top tejido en crochet fino para temporada calida.',
    'Prenda artesanal ligera con acabado manual. Perfecta para looks de vacaciones en Cartagena o Santa Marta.',
    85000,
    NULL,
    'COP',
    12,
    'active',
    FALSE,
    TRUE,
    FALSE,
    6
  ),
  (
    '33333333-3333-4333-8333-333333333323',
    '11111111-1111-4111-8111-111111111104',
    NULL,
    '22222222-2222-4222-8222-222222222201',
    'kimono-bogota-nights',
    'Kimono Bogota Nights',
    'Kimono ligero para capas en salidas nocturnas.',
    'Capa estilo kimono en viscosa suave. Ideal para restaurantes y eventos informales en Chapinero y la Zona G.',
    145000,
    NULL,
    'COP',
    18,
    'active',
    FALSE,
    TRUE,
    TRUE,
    5
  ),
  (
    '33333333-3333-4333-8333-333333333324',
    '11111111-1111-4111-8111-111111111104',
    NULL,
    '22222222-2222-4222-8222-222222222203',
    'pantalon-palazzo-arena',
    'Pantalon Palazzo Arena',
    'Pantalon palazzo de tiro alto y pierna amplia.',
    'Pantalon femenino comodo con caida elegante. Tono arena que combina con toda la coleccion de Moda Restrepo.',
    125000,
    139000,
    'COP',
    21,
    'active',
    FALSE,
    FALSE,
    TRUE,
    5
  ),
  -- Calzado Bucaramanga (6)
  (
    '33333333-3333-4333-8333-333333333325',
    '11111111-1111-4111-8111-111111111105',
    NULL,
    '22222222-2222-4222-8222-222222222204',
    'mocasin-cuero-bucaramanga',
    'Mocasin Cuero Bucaramanga',
    'Mocasin artesanal en cuero con costura reforzada.',
    'Calzado hecho en Bucaramanga con tradicion de taller. Suela flexible y acabado en cuero natural.',
    219000,
    NULL,
    'COP',
    27,
    'active',
    TRUE,
    TRUE,
    FALSE,
    10
  ),
  (
    '33333333-3333-4333-8333-333333333326',
    '11111111-1111-4111-8111-111111111105',
    NULL,
    '22222222-2222-4222-8222-222222222204',
    'bota-casual-bucaramanga',
    'Bota Casual Bucaramanga',
    'Bota casual de cuero con plantilla acolchada.',
    'Modelo versatil para ciudad fabricado en el taller santandereano con acabados premium.',
    289000,
    319000,
    'COP',
    18,
    'active',
    TRUE,
    TRUE,
    FALSE,
    10
  ),
  (
    '33333333-3333-4333-8333-333333333327',
    '11111111-1111-4111-8111-111111111105',
    NULL,
    '22222222-2222-4222-8222-222222222204',
    'sandalia-cuero-viejo',
    'Sandalia Cuero Viejo',
    'Sandalia artesanal en cuero envejecido.',
    'Sandalia unisex para clima calido. Hecha a mano con correas ajustables y suela de cuero.',
    159000,
    NULL,
    'COP',
    30,
    'active',
    FALSE,
    FALSE,
    FALSE,
    7
  ),
  (
    '33333333-3333-4333-8333-333333333328',
    '11111111-1111-4111-8111-111111111105',
    NULL,
    '22222222-2222-4222-8222-222222222204',
    'zapato-formal-manizales',
    'Zapato Formal Manizales',
    'Zapato formal de cuero con punta clasica.',
    'Calzado de vestir para hombre con acabado pulido. Inspirado en la elegancia cafetera de Manizales.',
    265000,
    NULL,
    'COP',
    21,
    'active',
    FALSE,
    TRUE,
    FALSE,
    9
  ),
  (
    '33333333-3333-4333-8333-333333333329',
    '11111111-1111-4111-8111-111111111105',
    NULL,
    '22222222-2222-4222-8222-222222222204',
    'tenis-artesanal-cafe',
    'Tenis Artesanal Cafe',
    'Tenis en cuero cafe con suela de goma natural.',
    'Tenis casual confeccionado en cuero vacuno colombiano. Combinacion de tradicion y estilo urbano.',
    235000,
    259000,
    'COP',
    24,
    'active',
    FALSE,
    TRUE,
    FALSE,
    8
  ),
  (
    '33333333-3333-4333-8333-333333333330',
    '11111111-1111-4111-8111-111111111105',
    NULL,
    '22222222-2222-4222-8222-222222222204',
    'botin-trabajo-levante',
    'Botin Trabajo Levante',
    'Botin de seguridad en cuero para trabajo pesado.',
    'Botin reforzado para cuadrillas y talleres. Suela antideslizante y puntera protectora interna.',
    198000,
    NULL,
    'COP',
    33,
    'active',
    FALSE,
    TRUE,
    FALSE,
    8
  );

-- -----------------------------------------------------------------------------
-- Product images (90) — 3 por producto
-- -----------------------------------------------------------------------------

INSERT INTO public.product_images (product_id, image_url, alt_text, sort_order, is_cover)
SELECT
  p.id,
  CASE ((ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY gs.n)) - 1) % 9
    WHEN 0 THEN '/placeholders/chaqueta-verde.svg'
    WHEN 1 THEN '/placeholders/chaqueta-negra.svg'
    WHEN 2 THEN '/placeholders/camisa-lino.svg'
    WHEN 3 THEN '/placeholders/camisa-oliva.svg'
    WHEN 4 THEN '/placeholders/pantalon-recto.svg'
    WHEN 5 THEN '/placeholders/pantalon-tabaco.svg'
    WHEN 6 THEN '/placeholders/tenis-cuero.svg'
    WHEN 7 THEN '/placeholders/tenis-negro.svg'
    ELSE '/placeholders/textura-taller.svg'
  END,
  p.name,
  gs.n,
  gs.n = 0
FROM public.products p
CROSS JOIN generate_series(0, 2) AS gs(n);

-- -----------------------------------------------------------------------------
-- Product variants (90) — 3 por producto (color + talla unicos)
-- -----------------------------------------------------------------------------

INSERT INTO public.product_variants (product_id, color_name, color_value, size, sku, stock, price)
SELECT
  p.id,
  vt.color_name,
  vt.color_value,
  vt.size,
  p.slug || '-' || lower(replace(vt.color_name, ' ', '-')) || '-' || vt.size,
  vt.stock,
  NULL
FROM public.products p
JOIN public.categories c ON c.id = p.category_id
CROSS JOIN LATERAL (
  SELECT *
  FROM (
    VALUES
      ('Negro',        '#111111', 'calzado',   '39', 8),
      ('Cafe',         '#8B4513', 'calzado',   '40', 7),
      ('Negro',        '#111111', 'calzado',   '41', 6),
      ('Azul marino',  '#1B2A4A', 'uniformes', '10', 9),
      ('Gris',         '#6B7280', 'uniformes', '12', 8),
      ('Azul marino',  '#1B2A4A', 'uniformes', '14', 7),
      ('Negro',        '#111111', 'default',   'M',  10),
      ('Verde bosque', '#2D5016', 'default',   'L',  8),
      ('Arena',        '#C4A77D', 'default',   'S',  6)
  ) AS all_variants(color_name, color_value, kind, size, stock)
  WHERE all_variants.kind = CASE
    WHEN c.slug = 'calzado' THEN 'calzado'
    WHEN c.slug = 'uniformes' THEN 'uniformes'
    ELSE 'default'
  END
) AS vt;

COMMIT;

-- =============================================================================
-- Resumen del seed
-- =============================================================================
-- workshops:        5
-- categories:       7
-- products:        30
-- product_images:  90
-- product_variants: 90
-- =============================================================================
