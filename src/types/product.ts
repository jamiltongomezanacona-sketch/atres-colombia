export type ProductColor = {
  name: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  workshopId: string;
  workshopName: string;
  workshopSlug: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  price: number;
  previousPrice?: number;
  discount?: string;
  colors: ProductColor[];
  sizes: string[];
  images: string[];
  available: boolean;
  madeToOrder: boolean;
  isNew?: boolean;
  material?: string;
  fabricationTime?: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
};
