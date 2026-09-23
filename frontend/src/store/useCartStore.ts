import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useEffect, useState } from 'react';
import { CartItem, SelectedOption } from '@/types';

export interface AddItemInput {
  menuItemId: string;
  name: string;
  basePrice: number;
  imageUrl?: string | null;
  selectedOptions?: SelectedOption[];
  quantity?: number;
}

interface CartState {
  items: CartItem[];
  orderType: 'DELIVERY' | 'COLLECTION';
  
  // Actions
  addItem: (input: AddItemInput) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  setOrderType: (type: 'DELIVERY' | 'COLLECTION') => void;
  
  // Computed helpers
  getItemCount: () => number;
  getSubtotal: () => number;
}

function generateCartItemId(menuItemId: string, selectedOptions: SelectedOption[] = []): string {
  const sortedOptions = [...selectedOptions]
    .sort((a, b) => `${a.groupName}:${a.optionName}`.localeCompare(`${b.groupName}:${b.optionName}`))
    .map((o) => `${o.groupName}:${o.optionName}:${o.additionalPrice}`)
    .join('|');
  return `${menuItemId}_${sortedOptions}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      orderType: 'DELIVERY',

      addItem: (input) => {
        const selectedOptions = input.selectedOptions || [];
        const additionalPrice = selectedOptions.reduce(
          (sum, opt) => sum + (Number(opt.additionalPrice) || 0),
          0
        );
        const unitPrice = input.basePrice + additionalPrice;
        const cartItemId = generateCartItemId(input.menuItemId, selectedOptions);
        const quantityToAdd = input.quantity && input.quantity > 0 ? input.quantity : 1;

        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.cartItemId === cartItemId
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + quantityToAdd,
            };
            return { items: updatedItems };
          }

          const newItem: CartItem = {
            cartItemId,
            menuItemId: input.menuItemId,
            name: input.name,
            basePrice: input.basePrice,
            unitPrice,
            quantity: quantityToAdd,
            imageUrl: input.imageUrl,
            selectedOptions,
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setOrderType: (orderType) => {
        set({ orderType });
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },
    }),
    {
      name: 'bees_treatz_cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Hook to avoid hydration mismatch when consuming cart store on SSR Next.js components.
 * Returns null or fallback until mounted on the client.
 */
export function useHydratedCartStore<T>(selector: (state: CartState) => T, fallback: T): T {
  const [hydrated, setHydrated] = useState(false);
  const result = useCartStore(selector);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated ? result : fallback;
}
