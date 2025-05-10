import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  openCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product: Product) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          
          if (existingItem) {
            // If item already exists, increase quantity
            return {
              items: state.items.map(item => 
                item.id === product.id 
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          } else {
            // Add new item with quantity 1
            return {
              items: [...state.items, { ...product, quantity: 1 }]
            };
          }
        });
      },
      
      removeItem: (id: number) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }));
      },
      
      updateQuantity: (id: number, quantity: number) => {
        set((state) => ({
          items: state.items.map(item => 
            item.id === id 
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          )
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
      
      closeCart: () => {
        set({ isOpen: false });
      },
      
      openCart: () => {
        set({ isOpen: true });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);