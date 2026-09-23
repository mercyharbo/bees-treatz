import { config } from '../config';

interface PostcodeLocation {
  postcode: string;
  latitude: number;
  longitude: number;
  adminDistrict?: string;
}

export interface DeliveryCalculationResult {
  valid: boolean;
  normalizedPostcode?: string;
  distanceMiles?: number;
  eligible: boolean;
  deliveryFee: number;
  reason?: string;
  destinationDistrict?: string;
}

// Haversine formula to compute distance in statute miles
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (angle: number) => (angle * Math.PI) / 180;
  const R = 3958.8; // Earth's radius in miles

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

let cachedRestaurantLocation: PostcodeLocation | null = null;

export async function lookupUKPostcode(postcode: string): Promise<PostcodeLocation | null> {
  const cleaned = postcode.trim().replace(/\s+/g, '');
  if (!cleaned) return null;

  try {
    const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(cleaned)}`);
    if (!response.ok) return null;

    const data = (await response.json()) as any;
    if (data.status === 200 && data.result) {
      return {
        postcode: data.result.postcode,
        latitude: data.result.latitude,
        longitude: data.result.longitude,
        adminDistrict: data.result.admin_district,
      };
    }
    return null;
  } catch (error) {
    console.error('Error querying postcodes.io:', error);
    return null;
  }
}

export async function getRestaurantLocation(): Promise<PostcodeLocation | null> {
  if (cachedRestaurantLocation) {
    return cachedRestaurantLocation;
  }

  const location = await lookupUKPostcode(config.delivery.restaurantPostcode);
  if (location) {
    cachedRestaurantLocation = location;
    return location;
  }

  // Fallback coordinates for default SE15 5BA (Peckham, London) if offline/mocking
  return {
    postcode: config.delivery.restaurantPostcode,
    latitude: 51.4743,
    longitude: -0.0694,
    adminDistrict: 'Southwark',
  };
}

export async function calculateDeliveryEligibility(
  customerPostcode: string,
  subtotal: number = 0
): Promise<DeliveryCalculationResult> {
  const customerLoc = await lookupUKPostcode(customerPostcode);
  if (!customerLoc) {
    return {
      valid: false,
      eligible: false,
      deliveryFee: 0,
      reason: 'Invalid UK Postcode. Please enter a valid UK postcode (e.g. SE15 5BA, SW9 8BN).',
    };
  }

  const restLoc = await getRestaurantLocation();
  if (!restLoc) {
    return {
      valid: true,
      normalizedPostcode: customerLoc.postcode,
      eligible: true,
      deliveryFee: config.delivery.baseFee,
      destinationDistrict: customerLoc.adminDistrict,
    };
  }

  const distance = calculateHaversineDistance(
    restLoc.latitude,
    restLoc.longitude,
    customerLoc.latitude,
    customerLoc.longitude
  );

  const roundedDistance = Math.round(distance * 10) / 10;

  if (distance > config.delivery.maxDistanceMiles) {
    return {
      valid: true,
      normalizedPostcode: customerLoc.postcode,
      distanceMiles: roundedDistance,
      eligible: false,
      deliveryFee: 0,
      reason: `Address is ${roundedDistance} miles away. We only deliver within ${config.delivery.maxDistanceMiles} miles of ${config.delivery.restaurantPostcode}. You can still choose Collection/Pickup!`,
      destinationDistrict: customerLoc.adminDistrict,
    };
  }

  // Check free delivery threshold
  if (subtotal >= config.delivery.freeDeliveryThreshold) {
    return {
      valid: true,
      normalizedPostcode: customerLoc.postcode,
      distanceMiles: roundedDistance,
      eligible: true,
      deliveryFee: 0,
      destinationDistrict: customerLoc.adminDistrict,
    };
  }

  // Standard fee: base + extra per mile
  const calculatedFee =
    config.delivery.baseFee +
    Math.max(0, roundedDistance - 1) * config.delivery.perMileFee;

  const roundedFee = Math.round(calculatedFee * 100) / 100;

  return {
    valid: true,
    normalizedPostcode: customerLoc.postcode,
    distanceMiles: roundedDistance,
    eligible: true,
    deliveryFee: roundedFee,
    destinationDistrict: customerLoc.adminDistrict,
  };
}
