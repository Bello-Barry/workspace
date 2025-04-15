// types/product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string; // Stocké comme string séparée par des virgules
  category: string;
  created_at: string;
}

export interface Category {
  name: string;
  image: string;
  count: number;
}
