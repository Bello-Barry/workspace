import { create } from "zustand";

// Définition unique du type CartItem
export type CartItem = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  images: string[] | string;
};

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void; // Modification ici
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cartItems.find((i) => i.id === item.id);
      
      if (existingItem) {
        return {
          cartItems: state.cartItems.map((i) =>
            i.id === item.id 
              ? { 
                  ...i, 
                  quantity: i.quantity + item.quantity // Utilisation de la quantité fournie
                } 
              : i
          ),
        };
      }
      return { 
        cartItems: [...state.cartItems, { 
          ...item,
          quantity: item.quantity // Utilisation de la quantité fournie
        }] 
      };
    }),
  removeFromCart: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),
  clearCart: () => set({ cartItems: [] }),
}));