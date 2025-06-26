import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

// Use environment variable for backend URL
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_HOST_URL;
console.log(BACKEND_BASE_URL);
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, userId?: string, userName?: string, userEmail?: string) => Promise<void>;
  removeItem: (id: string, userId?: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number, userId?: string) => Promise<void>;
  clearCart: (userId?: string) => Promise<void>;
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
      
      addItem: async (product: Product, userId?: string, userName?: string, userEmail?: string) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map(item => 
                item.id === product.id 
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          } else {
            return {
              items: [...state.items, { ...product, quantity: 1 }]
            };
          }
        });

        // Update purchase history draft with full product details
        if (userId && product._id) {
          const currentState = get();
          const itemToAdd = currentState.items.find(item => item.id === product.id);
          
          if (itemToAdd) {
            const patchBody = {
              items: [{
                _id: product._id,
                name: product.name,
                price: product.price,
                discount: product.discount || 0,
                barcode: product.barcode,
                image_url: product.image_url,
                description: product.description,
                quantity: itemToAdd.quantity,
                rating: product.rating,
                review: (product as any).review,
                category: product.category
              }],
              additionalAmount: product.price,
              name: userName,
              email: userEmail
            };

            try {
              const patchRes = await fetch(`${BACKEND_BASE_URL}/api/purchase-history/user/${encodeURIComponent(userId)}/items`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patchBody)
              });

              if (patchRes.status === 404 && userName && userEmail) {
                // Create purchase history if not exists, then retry PATCH
                await fetch(`${BACKEND_BASE_URL}/api/purchase-history`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId,
                    name: userName,
                    email: userEmail,
                    items: [{
                      _id: product._id,
                      name: product.name,
                      price: product.price,
                      discount: product.discount || 0,
                      barcode: product.barcode,
                      image_url: product.image_url,
                      description: product.description,
                      quantity: 1,
                      rating: product.rating,
                      review: (product as any).review,
                      category: product.category
                    }],
                    amount: product.price,
                    orderId: `draft_${Date.now()}`
                  })
                });
              }
            } catch (e) {
              console.error('Error updating purchase history:', e);
            }
          }
        }
      },
      
      removeItem: async (id: string, userId?: string) => {
        const currentState = get();
        const itemToRemove = currentState.items.find(item => item.id === id);
        
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }));

        // Remove from purchase history draft
        if (userId && itemToRemove) {
          try {
            await fetch(`${BACKEND_BASE_URL}/api/purchase-history/user/${encodeURIComponent(userId)}/items/delete`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ _ids: [itemToRemove._id] })
            });

            // Check if cart is empty and delete purchase history if so
            const newState = get();
            if (newState.items.length === 0) {
              await fetch(`${BACKEND_BASE_URL}/api/purchase-history/user/${encodeURIComponent(userId)}/draft`, {
                method: 'DELETE'
              });
            }
          } catch (e) {
            console.error('Error removing from purchase history:', e);
          }
        }
      },
      
      updateQuantity: async (id: string, quantity: number, userId?: string) => {
        const currentState = get();
        const itemToUpdate = currentState.items.find(item => item.id === id);
        
        set((state) => ({
          items: state.items.map(item => 
            item.id === id 
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          )
        }));

        // Update purchase history with new quantity
        if (userId && itemToUpdate && quantity > 0) {
          try {
            const updatedItem = {
              _id: itemToUpdate._id,
              name: itemToUpdate.name,
              price: itemToUpdate.price,
              discount: itemToUpdate.discount || 0,
              barcode: itemToUpdate.barcode,
              image_url: itemToUpdate.image_url,
              description: itemToUpdate.description,
              quantity: quantity,
              rating: itemToUpdate.rating,
              review: itemToUpdate.review,
              category: itemToUpdate.category
            };

            await fetch(`${BACKEND_BASE_URL}/api/purchase-history/user/${encodeURIComponent(userId)}/items/update`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                item: updatedItem,
                oldQuantity: itemToUpdate.quantity,
                newQuantity: quantity
              })
            });
          } catch (e) {
            console.error('Error updating quantity in purchase history:', e);
          }
        }
      },
      
      clearCart: async (userId?: string) => {
        set({ items: [] });
        
        // Delete purchase history draft if user is authenticated
        if (userId) {
          try {
            await fetch(`${BACKEND_BASE_URL}/api/purchase-history/user/${encodeURIComponent(userId)}/draft`, {
              method: 'DELETE'
            });
          } catch (e) {
            console.error('Error clearing purchase history draft:', e);
          }
        }
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