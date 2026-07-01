export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  primaryHref: string;
  secondaryHref: string;
  primaryLabel: string;
  secondaryLabel: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    title: "Moda colombiana directa del taller",
    subtitle: "Prendas hechas en Colombia con calidad artesanal y diseno urbano.",
    image: "/placeholders/chaqueta-verde.svg",
    primaryHref: "/#catalogo",
    secondaryHref: "/#chaquetas",
    primaryLabel: "Comprar ahora",
    secondaryLabel: "Ver coleccion",
  },
  {
    id: "slide-2",
    title: "Nueva coleccion de camisas",
    subtitle: "Telas frescas y cortes comodos para el dia a dia.",
    image: "/placeholders/camisa-lino.svg",
    primaryHref: "/#camisas",
    secondaryHref: "/#catalogo",
    primaryLabel: "Comprar ahora",
    secondaryLabel: "Ver coleccion",
  },
  {
    id: "slide-3",
    title: "Calzado artesanal colombiano",
    subtitle: "Cuero local, acabados premium y comodidad para caminar.",
    image: "/placeholders/tenis-cuero.svg",
    primaryHref: "/#calzado",
    secondaryHref: "/#catalogo",
    primaryLabel: "Comprar ahora",
    secondaryLabel: "Ver coleccion",
  },
];
