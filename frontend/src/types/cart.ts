export interface SelectedOption {
  groupName: string;
  optionName: string;
  additionalPrice: number;
}

export interface CartItem {
  cartItemId: string; // unique combo id: `${menuItemId}-${optionsHash}`
  menuItemId: string;
  name: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  imageUrl?: string | null;
  selectedOptions: SelectedOption[];
}

export interface AddItemInput {
  menuItemId: string;
  name: string;
  basePrice: number;
  imageUrl?: string | null;
  selectedOptions?: SelectedOption[];
  quantity?: number;
}
