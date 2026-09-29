import { create } from 'zustand';
import { format } from 'date-fns';
import { api } from '@/lib/api';
import { CateringCategory } from '@/types/catering';

export interface CateringStoreState {
  // Form Fields
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: string;
  selectedDate: Date | undefined;
  eventDate: string;
  venueLocation: string;
  venuePostcode: string;
  guestCount: number | '';
  services: string[];
  budgetRange: string;
  dietaryNotes: string;
  stylingNotes: string;

  // Active Menu Category Filter Tab
  activeCategoryTab: CateringCategory | 'all';

  // Submission Status
  submitting: boolean;
  submitted: boolean;
  error: string | null;

  // Actions
  setClientName: (clientName: string) => void;
  setClientEmail: (clientEmail: string) => void;
  setClientPhone: (clientPhone: string) => void;
  setEventType: (eventType: string) => void;
  setSelectedDate: (date: Date | undefined) => void;
  setVenueLocation: (venueLocation: string) => void;
  setVenuePostcode: (venuePostcode: string) => void;
  setGuestCount: (guestCount: number | '') => void;
  setBudgetRange: (budgetRange: string) => void;
  setDietaryNotes: (dietaryNotes: string) => void;
  setStylingNotes: (stylingNotes: string) => void;
  setActiveCategoryTab: (tab: CateringCategory | 'all') => void;

  toggleService: (service: string) => void;
  selectServiceAndScroll: (service: string) => void;
  selectEventTypeAndScroll: (eventType: string) => void;
  submitInquiry: () => Promise<void>;
  resetForm: () => void;
}

const scrollToInquiryForm = () => {
  if (typeof document !== 'undefined') {
    const el = document.getElementById('inquiry-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

export const useCateringStore = create<CateringStoreState>((set, get) => ({
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  eventType: 'Wedding',
  selectedDate: undefined,
  eventDate: '',
  venueLocation: '',
  venuePostcode: '',
  guestCount: 50,
  services: ['Grazing Table'],
  budgetRange: '£1,500 - £3,000',
  dietaryNotes: '',
  stylingNotes: '',
  activeCategoryTab: 'all',
  submitting: false,
  submitted: false,
  error: null,

  setClientName: (clientName) => set({ clientName }),
  setClientEmail: (clientEmail) => set({ clientEmail }),
  setClientPhone: (clientPhone) => set({ clientPhone }),
  setEventType: (eventType) => set({ eventType }),
  setSelectedDate: (selectedDate) =>
    set({
      selectedDate,
      eventDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
    }),
  setVenueLocation: (venueLocation) => set({ venueLocation }),
  setVenuePostcode: (venuePostcode) => set({ venuePostcode }),
  setGuestCount: (guestCount) => set({ guestCount }),
  setBudgetRange: (budgetRange) => set({ budgetRange }),
  setDietaryNotes: (dietaryNotes) => set({ dietaryNotes }),
  setStylingNotes: (stylingNotes) => set({ stylingNotes }),
  setActiveCategoryTab: (activeCategoryTab) => set({ activeCategoryTab }),

  toggleService: (service) => {
    const current = get().services;
    if (current.includes(service)) {
      set({ services: current.filter((s) => s !== service) });
    } else {
      set({ services: [...current, service] });
    }
  },

  selectServiceAndScroll: (service) => {
    const current = get().services;
    if (!current.includes(service)) {
      set({ services: [...current, service] });
    }
    scrollToInquiryForm();
  },

  selectEventTypeAndScroll: (eventType) => {
    set({ eventType });
    scrollToInquiryForm();
  },

  submitInquiry: async () => {
    const state = get();
    set({ submitting: true, error: null });

    if (!state.eventDate) {
      set({ error: 'Please select your event date.', submitting: false });
      return;
    }

    try {
      await api.post('/catering/inquire', {
        clientName: state.clientName,
        clientEmail: state.clientEmail,
        clientPhone: state.clientPhone,
        eventType: state.eventType,
        eventDate: state.eventDate,
        venueLocation: state.venueLocation,
        venuePostcode: state.venuePostcode,
        guestCount: Number(state.guestCount) || 1,
        services: state.services,
        budgetRange: state.budgetRange,
        dietaryNotes: state.dietaryNotes,
        stylingNotes: state.stylingNotes,
      });

      set({ submitted: true });
    } catch (err: any) {
      set({
        error:
          err?.message || 'Failed to submit catering inquiry. Please try again.',
      });
    } finally {
      set({ submitting: false });
    }
  },

  resetForm: () =>
    set({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      eventType: 'Wedding',
      selectedDate: undefined,
      eventDate: '',
      venueLocation: '',
      venuePostcode: '',
      guestCount: 50,
      services: ['Grazing Table'],
      budgetRange: '£1,500 - £3,000',
      dietaryNotes: '',
      stylingNotes: '',
      submitted: false,
      error: null,
    }),
}));
