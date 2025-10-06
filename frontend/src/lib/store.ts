import { create } from 'zustand';
import { Product, User, mockProducts, mockUser } from './mockData.ts';

interface AppState {
  user: User | null;
  products: Product[];
  isWalletConnected: boolean;
  connectWallet: (role: User['role']) => void;
  disconnectWallet: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  getProduct: (productId: string) => Product | undefined;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  products: mockProducts,
  isWalletConnected: false,

  connectWallet: (role) => {
    const mockAddress = `0x${Math.random().toString(16).slice(2, 42)}`;
    const roleNames = {
      Manufacturer: 'MediCorp Inc',
      Distributor: 'Global Distribution Ltd',
      Pharmacy: 'HealthPlus Pharmacy',
      Patient: 'John Doe',
    };

    set({
      isWalletConnected: true,
      user: {
        ...mockUser,
        address: mockAddress,
        name: roleNames[role],
        role,
        email: `contact@${role.toLowerCase()}.com`,
      },
    });
  },

  disconnectWallet: () => {
    set({ isWalletConnected: false, user: null });
  },

  addProduct: (product) => {
    set((state) => ({
      products: [product, ...state.products],
    }));
  },

  updateProduct: (productId, updates) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.productId === productId ? { ...p, ...updates } : p
      ),
    }));
  },

  getProduct: (productId) => {
    return get().products.find((p) => p.productId === productId);
  },
}));
