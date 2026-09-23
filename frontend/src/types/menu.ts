export interface Option {
  id: string;
  name: string;
  additionalPrice: number;
  isAvailable: boolean;
}

export interface OptionGroup {
  id: string;
  name: string;
  required: boolean;
  minSelect: number;
  maxSelect: number;
  options: Option[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  isSpicy: boolean;
  isVegetarian: boolean;
  allergens: string[];
  optionGroups: OptionGroup[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  displayOrder: number;
  items: MenuItem[];
}

export interface GetMenuResponse {
  success: boolean;
  categories: Category[];
}

export interface GetMenuItemResponse {
  success: boolean;
  item: MenuItem;
}
