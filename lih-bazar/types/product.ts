export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  created_at: string;
}

export interface Category {
  name: string;
  image: string;
  count: number;
}
