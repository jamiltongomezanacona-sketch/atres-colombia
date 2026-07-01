export type WorkshopSocials = {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
};

export type WorkshopStatus = "active" | "pending" | "inactive";

export type Workshop = {
  id: string;
  slug: string;
  name: string;
  verified: boolean;
  location: string;
  city: string;
  department: string;
  description: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  coverImage: string;
  logo: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  socials?: WorkshopSocials;
  productionTime: string;
  minimumOrder?: number;
  supportsCustomization: boolean;
  supportsHomeTrial: boolean;
  deliveryCities: string[];
  categories: string[];
  productCount: number;
  status: WorkshopStatus;
};

/** Registro crudo en data/; productCount se calcula en el repositorio. */
export type WorkshopRecord = Omit<Workshop, "productCount">;
