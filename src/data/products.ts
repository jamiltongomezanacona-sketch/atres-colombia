import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "prod-001",
    slug: "chaqueta-bogota-verde",
    workshopId: "ws-atres-colombia",
    workshopName: "AtresColombia",
    workshopSlug: "atres-colombia",
    name: "Chaqueta Bogota Verde",
    category: "Chaquetas",
    description: "Chaqueta ligera con corte urbano y acabado resistente.",
    longDescription:
      "Una prenda versatil para clima templado, confeccionada en taller colombiano con bolsillos amplios, cierre frontal y silueta limpia para uso diario.",
    price: 189000,
    previousPrice: 229000,
    discount: "17%",
    colors: [
      { name: "Verde bosque", value: "#173f2e" },
      { name: "Negro", value: "#101211" },
      { name: "Arena", value: "#b7a783" },
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/placeholders/chaqueta-verde.svg",
      "/placeholders/chaqueta-negra.svg",
      "/placeholders/textura-taller.svg",
    ],
    available: true,
    madeToOrder: true,
    isNew: true,
    material: "Algodon mezclado con poliester reciclado",
    fabricationTime: "5 a 7 dias habiles",
  },
  {
    id: "prod-002",
    slug: "camisa-medellin-lino",
    workshopId: "ws-atres-colombia",
    workshopName: "AtresColombia",
    workshopSlug: "atres-colombia",
    name: "Camisa Medellin Lino",
    category: "Camisas",
    description: "Camisa fresca de manga corta con textura natural.",
    longDescription:
      "Camisa pensada para dias calidos, hecha en lino mezclado con cuello abierto, caida suave y costuras reforzadas.",
    price: 119000,
    colors: [
      { name: "Marfil", value: "#eee3cf" },
      { name: "Oliva", value: "#59664a" },
      { name: "Carbon", value: "#262927" },
    ],
    sizes: ["S", "M", "L"],
    images: [
      "/placeholders/camisa-lino.svg",
      "/placeholders/camisa-oliva.svg",
      "/placeholders/textura-taller.svg",
    ],
    available: true,
    madeToOrder: false,
    isNew: true,
    material: "Lino mezclado 55% lino, 45% algodon",
    fabricationTime: "3 a 5 dias habiles",
  },
  {
    id: "prod-003",
    slug: "pantalon-cali-recto",
    workshopId: "ws-atres-colombia",
    workshopName: "AtresColombia",
    workshopSlug: "atres-colombia",
    name: "Pantalon Cali Recto",
    category: "Pantalones",
    description: "Pantalon recto con pretina comoda y tela flexible.",
    longDescription:
      "Un basico de taller para rotacion diaria, con horma recta, bolsillos funcionales y una mezcla textil que conserva la forma.",
    price: 154000,
    previousPrice: 179000,
    discount: "14%",
    colors: [
      { name: "Negro", value: "#101010" },
      { name: "Tabaco", value: "#6b4f2d" },
      { name: "Verde noche", value: "#0e2c22" },
    ],
    sizes: ["28", "30", "32", "34", "36"],
    images: [
      "/placeholders/pantalon-recto.svg",
      "/placeholders/pantalon-tabaco.svg",
      "/placeholders/textura-taller.svg",
    ],
    available: true,
    madeToOrder: true,
    material: "Algodon stretch con elastano",
    fabricationTime: "4 a 6 dias habiles",
  },
  {
    id: "prod-004",
    slug: "tenis-barranquilla-cuero",
    workshopId: "ws-atres-colombia",
    workshopName: "AtresColombia",
    workshopSlug: "atres-colombia",
    name: "Tenis Barranquilla Cuero",
    category: "Calzado",
    description: "Tenis de cuero con suela ligera y acabado minimalista.",
    longDescription:
      "Calzado casual fabricado en cuero colombiano, con interior suave, suela flexible y lineas limpias para combinar con prendas urbanas.",
    price: 249000,
    colors: [
      { name: "Blanco roto", value: "#ede8dc" },
      { name: "Negro", value: "#111111" },
      { name: "Cafe", value: "#694323" },
    ],
    sizes: ["37", "38", "39", "40", "41", "42"],
    images: [
      "/placeholders/tenis-cuero.svg",
      "/placeholders/tenis-negro.svg",
      "/placeholders/textura-taller.svg",
    ],
    available: true,
    madeToOrder: false,
    material: "Cuero vacuno colombiano con suela EVA",
    fabricationTime: "Entrega inmediata desde taller",
  },
  {
    id: "prod-005",
    slug: "uniforme-colegio-soacha",
    workshopId: "ws-confecciones-soacha",
    workshopName: "Confecciones Soacha",
    workshopSlug: "confecciones-soacha",
    name: "Uniforme Colegio Soacha",
    category: "Uniformes",
    description: "Uniforme escolar resistente con bordado personalizable.",
    longDescription:
      "Conjunto escolar confeccionado en drill reforzado, ideal para colegios locales. Incluye opcion de bordado de institucion.",
    price: 89000,
    colors: [
      { name: "Azul marino", value: "#1a2f4d" },
      { name: "Gris", value: "#6b7280" },
    ],
    sizes: ["6", "8", "10", "12", "14", "16"],
    images: [
      "/placeholders/camisa-lino.svg",
      "/placeholders/textura-taller.svg",
    ],
    available: true,
    madeToOrder: true,
    material: "Drill de algodon y poliester",
    fabricationTime: "4 a 8 dias habiles",
  },
  {
    id: "prod-006",
    slug: "dotacion-empresarial-soacha",
    workshopId: "ws-confecciones-soacha",
    workshopName: "Confecciones Soacha",
    workshopSlug: "confecciones-soacha",
    name: "Dotacion Empresarial",
    category: "Uniformes",
    description: "Camisa y pantalon para dotacion corporativa por pedido.",
    longDescription:
      "Set basico de dotacion laboral con costuras reforzadas y opciones de tallaje amplio para equipos de trabajo.",
    price: 135000,
    colors: [
      { name: "Blanco", value: "#f5f5f5" },
      { name: "Negro", value: "#111111" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/placeholders/camisa-oliva.svg",
      "/placeholders/pantalon-recto.svg",
    ],
    available: true,
    madeToOrder: true,
    material: "Oxford y drill industrial",
    fabricationTime: "5 a 8 dias habiles",
  },
  {
    id: "prod-007",
    slug: "blazer-urbano-victorino",
    workshopId: "ws-taller-san-victorino",
    workshopName: "Taller San Victorino",
    workshopSlug: "taller-san-victorino",
    name: "Blazer Urbano Victorino",
    category: "Chaquetas",
    description: "Blazer ligero con corte moderno para uso diario.",
    longDescription:
      "Prenda confeccionada en el circuito de San Victorino con excelente relacion calidad-precio y acabados comerciales.",
    price: 175000,
    previousPrice: 199000,
    discount: "12%",
    colors: [
      { name: "Negro", value: "#101010" },
      { name: "Azul noche", value: "#1e2a44" },
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/placeholders/chaqueta-negra.svg",
      "/placeholders/textura-taller.svg",
    ],
    available: true,
    madeToOrder: false,
    isNew: true,
    material: "Poliester con forro ligero",
    fabricationTime: "3 a 6 dias habiles",
  },
  {
    id: "prod-008",
    slug: "blusa-lino-restrepo",
    workshopId: "ws-moda-restrepo",
    workshopName: "Moda Restrepo",
    workshopSlug: "moda-restrepo",
    name: "Blusa Lino Restrepo",
    category: "Camisas",
    description: "Blusa fresca de lino con caida suave y cuello redondo.",
    longDescription:
      "Prenda femenina ideal para clima calido, confeccionada en telas naturales seleccionadas por Moda Restrepo.",
    price: 99000,
    colors: [
      { name: "Natural", value: "#eee3cf" },
      { name: "Rosa palo", value: "#d4a5a5" },
    ],
    sizes: ["S", "M", "L"],
    images: [
      "/placeholders/camisa-oliva.svg",
      "/placeholders/camisa-lino.svg",
    ],
    available: true,
    madeToOrder: false,
    material: "Lino y algodon",
    fabricationTime: "2 a 5 dias habiles",
  },
  {
    id: "prod-009",
    slug: "hoodie-kennedy-urban",
    workshopId: "ws-tienda-kennedy",
    workshopName: "Tienda Kennedy",
    workshopSlug: "tienda-kennedy",
    name: "Hoodie Kennedy Urban",
    category: "Chaquetas",
    description: "Hoodie oversize con capucha reforzada y felpa suave.",
    longDescription:
      "Basico streetwear de Tienda Kennedy, pensado para uso diario con estilo urbano y comodidad.",
    price: 129000,
    colors: [
      { name: "Negro", value: "#111111" },
      { name: "Verde oliva", value: "#4a5d3f" },
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/placeholders/chaqueta-verde.svg",
      "/placeholders/pantalon-tabaco.svg",
    ],
    available: true,
    madeToOrder: false,
    isNew: true,
    material: "Algodon peinado con felpa interior",
    fabricationTime: "3 a 5 dias habiles",
  },
  {
    id: "prod-010",
    slug: "mocasin-cuero-bucaramanga",
    workshopId: "ws-calzado-bucaramanga",
    workshopName: "Calzado Bucaramanga",
    workshopSlug: "calzado-bucaramanga",
    name: "Mocasin Cuero Bucaramanga",
    category: "Calzado",
    description: "Mocasin artesanal en cuero con costura reforzada.",
    longDescription:
      "Calzado hecho en Bucaramanga con tradicion de taller. Suela flexible y acabado en cuero natural.",
    price: 219000,
    colors: [
      { name: "Cafe", value: "#694323" },
      { name: "Negro", value: "#111111" },
    ],
    sizes: ["38", "39", "40", "41", "42"],
    images: [
      "/placeholders/tenis-cuero.svg",
      "/placeholders/tenis-negro.svg",
    ],
    available: true,
    madeToOrder: true,
    material: "Cuero vacuno y suela de cuero",
    fabricationTime: "5 a 10 dias habiles",
  },
  {
    id: "prod-011",
    slug: "bota-casual-bucaramanga",
    workshopId: "ws-calzado-bucaramanga",
    workshopName: "Calzado Bucaramanga",
    workshopSlug: "calzado-bucaramanga",
    name: "Bota Casual Bucaramanga",
    category: "Calzado",
    description: "Bota casual de cuero con plantilla acolchada.",
    longDescription:
      "Modelo versatil para ciudad, fabricado en el taller santandereano con acabados premium.",
    price: 289000,
    previousPrice: 319000,
    discount: "9%",
    colors: [
      { name: "Tabaco", value: "#6b4f2d" },
      { name: "Negro", value: "#101010" },
    ],
    sizes: ["38", "39", "40", "41", "42", "43"],
    images: [
      "/placeholders/tenis-negro.svg",
      "/placeholders/textura-taller.svg",
    ],
    available: true,
    madeToOrder: true,
    material: "Cuero y suela TR",
    fabricationTime: "6 a 10 dias habiles",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByWorkshopSlug(workshopSlug: string) {
  return products.filter((product) => product.workshopSlug === workshopSlug);
}

export function getRelatedProducts(slug: string, limit = 3) {
  const product = getProductBySlug(slug);

  if (!product) {
    return [];
  }

  const sameWorkshop = products.filter(
    (item) => item.workshopSlug === product.workshopSlug && item.slug !== slug,
  );

  if (sameWorkshop.length >= limit) {
    return sameWorkshop.slice(0, limit);
  }

  const sameCategory = products.filter(
    (item) =>
      item.category === product.category &&
      item.slug !== slug &&
      item.workshopSlug !== product.workshopSlug,
  );

  return [...sameWorkshop, ...sameCategory].slice(0, limit);
}
