import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PostcodeValidationResponse } from '@/types';

export interface CheckoutCustomerInfo {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryPostcode: string;
  specialInstructions: string;
}

interface CheckoutState {
  customerInfo: CheckoutCustomerInfo;
  postcodeValidation: PostcodeValidationResponse | null;
  isValidatingPostcode: boolean;
  
  // Actions
  setCustomerInfo: (info: Partial<CheckoutCustomerInfo>) => void;
  setPostcodeValidation: (validation: PostcodeValidationResponse | null) => void;
  setIsValidatingPostcode: (validating: boolean) => void;
  resetCheckout: () => void;
}

const initialCustomerInfo: CheckoutCustomerInfo = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  deliveryAddress: '',
  deliveryPostcode: '',
  specialInstructions: '',
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      customerInfo: initialCustomerInfo,
      postcodeValidation: null,
      isValidatingPostcode: false,

      setCustomerInfo: (info) => {
        set((state) => ({
          customerInfo: { ...state.customerInfo, ...info },
        }));
      },

      setPostcodeValidation: (validation) => {
        set({ postcodeValidation: validation });
      },

      setIsValidatingPostcode: (isValidatingPostcode) => {
        set({ isValidatingPostcode });
      },

      resetCheckout: () => {
        set({
          customerInfo: initialCustomerInfo,
          postcodeValidation: null,
          isValidatingPostcode: false,
        });
      },
    }),
    {
      name: 'bees_treatz_checkout',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
