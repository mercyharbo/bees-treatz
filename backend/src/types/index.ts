export type AdminRole = 'ADMIN' | 'KITCHEN';
export const AdminRole = {
  ADMIN: 'ADMIN',
  KITCHEN: 'KITCHEN',
} as const;

export type OrderType = 'DELIVERY' | 'COLLECTION';
export const OrderType = {
  DELIVERY: 'DELIVERY',
  COLLECTION: 'COLLECTION',
} as const;

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_COLLECTION'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';
export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY_FOR_COLLECTION: 'READY_FOR_COLLECTION',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';
export const PaymentStatus = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
} as const;

export interface CartOptionSelection {
  groupName: string;
  optionName: string;
  additionalPrice: number;
}

export interface CreateOrderItemInput {
  menuItemId: string;
  quantity: number;
  selectedOptions?: CartOptionSelection[];
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: 'DELIVERY' | 'COLLECTION';
  deliveryAddress?: string;
  deliveryPostcode?: string;
  specialInstructions?: string;
  items: CreateOrderItemInput[];
}
