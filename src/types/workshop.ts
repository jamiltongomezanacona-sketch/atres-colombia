export type Workshop = {
  id: string;
  slug: string;
  name: string;
  location: string;
  description: string;
  specialties: string[];
  rating: number;
  reviews: number;
  verified: boolean;
  verifiedLabel: "Taller verificado" | "Tienda verificada";
  coverImage: string;
  logoImage: string;
  averageProductionTime: string;
  productIds: string[];
  whatsapp?: string;
};
