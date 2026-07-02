import type { WorkshopRecord, WorkshopStatus } from "@/types/workshop";

export type SupabaseWorkshopRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  department: string;
  country: string;
  logo_url: string | null;
  cover_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  verified: boolean;
  rating: number;
  review_count: number;
  supports_customization: boolean;
  supports_home_trial: boolean;
  production_time: string | null;
  minimum_order: number | null;
  status: string;
};

export function mapSupabaseWorkshopRow(row: SupabaseWorkshopRow): WorkshopRecord {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    kind: row.name.toLowerCase().includes("tienda") ? "store" : "workshop",
    verified: row.verified,
    location: `${row.city}, ${row.department}`,
    city: row.city,
    department: row.department,
    description: row.description,
    specialties: [],
    rating: Number(row.rating),
    reviewCount: row.review_count,
    coverImage: row.cover_url ?? "/placeholders/textura-taller.svg",
    logo: row.logo_url ?? "/placeholders/textura-taller.svg",
    phone: row.phone ?? undefined,
    whatsapp: row.whatsapp ?? undefined,
    email: row.email ?? undefined,
    website: row.website ?? undefined,
    productionTime: row.production_time ?? "Consultar con el taller",
    minimumOrder: row.minimum_order ?? undefined,
    supportsCustomization: row.supports_customization,
    supportsHomeTrial: row.supports_home_trial,
    deliveryCities: [row.city],
    categories: [],
    status: row.status as WorkshopStatus,
  };
}

export function mapSupabaseWorkshopRows(rows: SupabaseWorkshopRow[]): WorkshopRecord[] {
  return rows.map(mapSupabaseWorkshopRow);
}
