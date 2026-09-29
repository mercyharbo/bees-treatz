import { create } from 'zustand';
import { MenuItem } from '@/types/menu';
import { SelectedOption } from '@/types/cart';
import { useCartStore } from './useCartStore';

export interface MenuStoreState {
  // Filter & Search State
  activeCategorySlug: string;
  searchQuery: string;
  dietaryFilter: 'all' | 'spicy' | 'vegetarian';

  // Customizer Modal State
  isCustomizerOpen: boolean;
  selectedItemForCustomization: MenuItem | null;
  selectedOptions: Record<string, SelectedOption>;
  customizationQuantity: number;
  customizationNotes: string;

  // Actions
  setActiveCategorySlug: (slug: string) => void;
  setSearchQuery: (query: string) => void;
  setDietaryFilter: (filter: 'all' | 'spicy' | 'vegetarian') => void;
  resetFilters: () => void;

  openCustomizer: (item: MenuItem) => void;
  closeCustomizer: () => void;
  initItemDetails: (item: MenuItem) => void;
  selectOption: (
    groupId: string,
    groupName: string,
    optionName: string,
    additionalPrice: number
  ) => void;
  setCustomizationQuantity: (quantity: number) => void;
  setCustomizationNotes: (notes: string) => void;
  addCustomizedItemToCart: () => void;
}

export const useMenuStore = create<MenuStoreState>((set, get) => ({
  activeCategorySlug: 'all',
  searchQuery: '',
  dietaryFilter: 'all',

  isCustomizerOpen: false,
  selectedItemForCustomization: null,
  selectedOptions: {},
  customizationQuantity: 1,
  customizationNotes: '',

  setActiveCategorySlug: (activeCategorySlug) => set({ activeCategorySlug }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setDietaryFilter: (dietaryFilter) => set({ dietaryFilter }),
  resetFilters: () =>
    set({
      activeCategorySlug: 'all',
      searchQuery: '',
      dietaryFilter: 'all',
    }),

  openCustomizer: (item) => {
    // Automatically pre-select first option for required groups
    const initialOptions: Record<string, SelectedOption> = {};

    if (item.optionGroups && item.optionGroups.length > 0) {
      item.optionGroups.forEach((group) => {
        if (group.required && group.options && group.options.length > 0) {
          const firstOpt = group.options[0];
          initialOptions[group.id] = {
            groupName: group.name,
            optionName: firstOpt.name,
            additionalPrice: Number(firstOpt.additionalPrice) || 0,
          };
        }
      });
    }

    set({
      selectedItemForCustomization: item,
      selectedOptions: initialOptions,
      customizationQuantity: 1,
      customizationNotes: '',
      isCustomizerOpen: true,
    });
  },

  closeCustomizer: () =>
    set({
      isCustomizerOpen: false,
      selectedItemForCustomization: null,
      selectedOptions: {},
      customizationQuantity: 1,
      customizationNotes: '',
    }),

  initItemDetails: (item) => {
    if (get().selectedItemForCustomization?.id === item.id) return;

    const initialOptions: Record<string, SelectedOption> = {};
    if (item.optionGroups && item.optionGroups.length > 0) {
      item.optionGroups.forEach((group) => {
        if (group.required && group.options && group.options.length > 0) {
          const firstOpt = group.options[0];
          initialOptions[group.id] = {
            groupName: group.name,
            optionName: firstOpt.name,
            additionalPrice: Number(firstOpt.additionalPrice) || 0,
          };
        }
      });
    }

    set({
      selectedItemForCustomization: item,
      selectedOptions: initialOptions,
      customizationQuantity: 1,
      customizationNotes: '',
    });
  },

  selectOption: (groupId, groupName, optionName, additionalPrice) => {
    set((state) => ({
      selectedOptions: {
        ...state.selectedOptions,
        [groupId]: {
          groupName,
          optionName,
          additionalPrice: Number(additionalPrice) || 0,
        },
      },
    }));
  },

  setCustomizationQuantity: (qty) =>
    set({ customizationQuantity: Math.max(1, qty) }),

  setCustomizationNotes: (notes) => set({ customizationNotes: notes }),

  addCustomizedItemToCart: () => {
    const {
      selectedItemForCustomization,
      selectedOptions,
      customizationQuantity,
    } = get();

    if (!selectedItemForCustomization) return;

    const optionsList: SelectedOption[] = Object.values(selectedOptions);

    useCartStore.getState().addItem({
      menuItemId: selectedItemForCustomization.id,
      name: selectedItemForCustomization.name,
      basePrice: selectedItemForCustomization.basePrice,
      imageUrl: selectedItemForCustomization.imageUrl,
      selectedOptions: optionsList,
      quantity: customizationQuantity,
    });

    set({
      isCustomizerOpen: false,
      customizationQuantity: 1,
      customizationNotes: '',
    });
  },
}));
