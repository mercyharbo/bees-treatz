export interface PostcodeValidationRequest {
  postcode: string;
  subtotal?: number;
}

export interface PostcodeValidationResponse {
  valid: boolean;
  normalizedPostcode?: string;
  distanceMiles?: number;
  eligible: boolean;
  deliveryFee: number;
  reason?: string;
  destinationDistrict?: string;
}

export interface ValidatePostcodeResponse {
  success: boolean;
  data: PostcodeValidationResponse;
  restaurantInfo?: {
    postcode: string;
    maxDistanceMiles: number;
    freeDeliveryThreshold: number;
  };
}
