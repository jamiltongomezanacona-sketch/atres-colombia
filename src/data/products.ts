import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "prod-001",
    slug: "chaqueta-bogota-verde",
    workshopId: "atres-main-workshop",
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
  },
  {
    id: "prod-002",
    slug: "camisa-medellin-lino",
    workshopId: "atres-main-workshop",
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
  },
  {
    id: "prod-003",
    slug: "pantalon-cali-recto",
    workshopId: "atres-main-workshop",
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
  },
  {
    id: "prod-004",
    slug: "tenis-barranquilla-cuero",
    workshopId: "atres-main-workshop",
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
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
