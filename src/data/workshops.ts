import type { Workshop } from "@/types/workshop";

export const workshops: Workshop[] = [
  {
    id: "ws-atres-colombia",
    slug: "atres-colombia",
    name: "AtresColombia",
    location: "Bogota, Cundinamarca",
    description:
      "Tienda principal de AtresColombia. Moda urbana confeccionada en taller propio con enfoque en calidad, diseno limpio y venta directa al cliente.",
    specialties: ["Chaquetas", "Camisas", "Pantalones", "Calzado"],
    rating: 4.9,
    reviews: 128,
    verified: true,
    verifiedLabel: "Tienda verificada",
    coverImage: "/placeholders/chaqueta-verde.svg",
    logoImage: "/logo.png",
    averageProductionTime: "5 a 7 dias habiles",
    productIds: ["prod-001", "prod-002", "prod-003", "prod-004"],
    whatsapp: "573001234567",
  },
  {
    id: "ws-confecciones-soacha",
    slug: "confecciones-soacha",
    name: "Confecciones Soacha",
    location: "Soacha, Cundinamarca",
    description:
      "Taller familiar especializado en uniformes escolares, dotaciones y confeccion por pedido para empresas locales.",
    specialties: ["Uniformes", "Dotaciones", "Confeccion por pedido"],
    rating: 4.7,
    reviews: 86,
    verified: true,
    verifiedLabel: "Taller verificado",
    coverImage: "/placeholders/camisa-lino.svg",
    logoImage: "/placeholders/textura-taller.svg",
    averageProductionTime: "4 a 8 dias habiles",
    productIds: ["prod-005", "prod-006"],
    whatsapp: "573001234568",
  },
  {
    id: "ws-taller-san-victorino",
    slug: "taller-san-victorino",
    name: "Taller San Victorino",
    location: "San Victorino, Bogota",
    description:
      "Punto de confeccion en el corazon comercial de Bogota. Prendas urbanas, produccion rapida y atencion personalizada.",
    specialties: ["Ropa urbana", "Temporada", "Mayorista"],
    rating: 4.6,
    reviews: 214,
    verified: true,
    verifiedLabel: "Taller verificado",
    coverImage: "/placeholders/chaqueta-negra.svg",
    logoImage: "/placeholders/textura-taller.svg",
    averageProductionTime: "3 a 6 dias habiles",
    productIds: ["prod-007"],
    whatsapp: "573001234569",
  },
  {
    id: "ws-moda-restrepo",
    slug: "moda-restrepo",
    name: "Moda Restrepo",
    location: "Restrepo, Bogota",
    description:
      "Tienda de barrio con colecciones femeninas y masculinas. Enfoque en telas frescas y siluetas comodas para el dia a dia.",
    specialties: ["Moda femenina", "Moda masculina", "Accesorios"],
    rating: 4.8,
    reviews: 97,
    verified: true,
    verifiedLabel: "Tienda verificada",
    coverImage: "/placeholders/camisa-oliva.svg",
    logoImage: "/placeholders/textura-taller.svg",
    averageProductionTime: "2 a 5 dias habiles",
    productIds: ["prod-008"],
    whatsapp: "573001234570",
  },
  {
    id: "ws-tienda-kennedy",
    slug: "tienda-kennedy",
    name: "Tienda Kennedy",
    location: "Kennedy, Bogota",
    description:
      "Tienda local con catalogo variado de hoodies, pantalones y basicos urbanos para publico joven.",
    specialties: ["Streetwear", "Basicos", "Hoodies"],
    rating: 4.5,
    reviews: 73,
    verified: true,
    verifiedLabel: "Tienda verificada",
    coverImage: "/placeholders/pantalon-recto.svg",
    logoImage: "/placeholders/textura-taller.svg",
    averageProductionTime: "3 a 5 dias habiles",
    productIds: ["prod-009"],
    whatsapp: "573001234571",
  },
  {
    id: "ws-calzado-bucaramanga",
    slug: "calzado-bucaramanga",
    name: "Calzado Bucaramanga",
    location: "Bucaramanga, Santander",
    description:
      "Fabricante de calzado en cuero y sintetico con tradicion artesanal santandereana y acabados duraderos.",
    specialties: ["Calzado", "Cuero", "Suela artesanal"],
    rating: 4.9,
    reviews: 156,
    verified: true,
    verifiedLabel: "Taller verificado",
    coverImage: "/placeholders/tenis-cuero.svg",
    logoImage: "/placeholders/textura-taller.svg",
    averageProductionTime: "5 a 10 dias habiles",
    productIds: ["prod-010", "prod-011"],
    whatsapp: "573001234572",
  },
];

export function getWorkshopBySlug(slug: string) {
  return workshops.find((workshop) => workshop.slug === slug);
}

export function getWorkshopById(id: string) {
  return workshops.find((workshop) => workshop.id === id);
}
