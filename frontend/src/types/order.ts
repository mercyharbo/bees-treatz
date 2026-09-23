import { SelectedOption } from './cart';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_COLLECTION'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';

export interface OrderItemRecord {
  id: string;
  itemName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  selectedOptions: SelectedOption[];
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: 'DELIVERY' | 'COLLECTION';
  deliveryAddress?: string | null;
  deliveryPostcode?: string | null;
  deliveryFee: number;
  subtotal: number;
  total: number;
  specialInstructions?: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  items: OrderItemRecord[];
}

export interface CreateOrderItemInput {
  menuItemId: string;
  quantity: number;
  selectedOptions?: SelectedOption[];
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

export interface CreateOrderResponse {
  success: boolean;
  order: OrderRecord;
}

export interface GetOrderResponse {
  success: boolean;
  order: OrderRecord;
}

export interface GetAllOrdersResponse {
  success: boolean;
  orders: OrderRecord[];
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  order: OrderRecord;
}
