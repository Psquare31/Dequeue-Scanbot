import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoginModalOpen: false,
      
      login: async (email: string, password: string) => {
        try {
          // In a real app, you would validate credentials with your backend
          // This is a mock implementation
          if (email && password.length >= 6) {
            // Mock successful login
            set({
              user: {
                id: '1',
                email,
                name: email.split('@')[0],
              },
              isAuthenticated: true,
              isLoginModalOpen: false,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
      
      openLoginModal: () => {
        set({ isLoginModalOpen: true });
      },
      
      closeLoginModal: () => {
        set({ isLoginModalOpen: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);