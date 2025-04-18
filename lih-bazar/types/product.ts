// types/product.ts

// types/product.ts
export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: string[] | string;
  description?: string;
  metadata?: Record<string, any>; // <-- Ajoutez cette ligne
  // ... autres propriétés
};



export interface Category {
  name: string;
  image: string;
  count: number;
}
