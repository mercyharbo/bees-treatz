export type CateringCategory = 'grazing' | 'canapes' | 'bar' | 'bowls';

export interface CateringPackageItem {
  id: string;
  category: CateringCategory;
  title: string;
  serves: string;
  price: string;
  image: string;
  tag?: string;
  description: string;
  inclusions: string[];
  serviceKey: string;
}

export interface CateringServicePillar {
  id: string;
  title: string;
  tag: string;
  image: string;
  description: string;
  features: string[];
  price: string;
  serviceKey: string;
}

export interface CateringStoryPillar {
  number: string;
  title: string;
  description: string;
}

export interface CateringEventTypeItem {
  title: string;
  subtitle: string;
  image: string;
  description: string;
  badge: string;
  eventVal: string;
}

export interface CateringFaqItem {
  question: string;
  answer: string;
}

export interface CateringInquiryInput {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: string;
  eventDate: string;
  venueLocation: string;
  venuePostcode?: string;
  guestCount: number;
  services: string[];
  budgetRange?: string;
  dietaryNotes?: string;
  stylingNotes?: string;
}
