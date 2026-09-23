export interface CreateCheckoutSessionInput {
  orderId: string;
}

export interface CreateCheckoutSessionResponse {
  checkoutUrl: string;
  isSimulated?: boolean;
  success?: boolean;
}

export interface PaymentStatusDetails {
  orderId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED';
}
