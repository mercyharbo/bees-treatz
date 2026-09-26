import { create } from 'zustand';
import { api } from '@/lib/api';
import { UserProfile } from '@/types/auth';
import { useAuthStore } from './useAuthStore';

export interface ProfileState {
  activeTab: string;
  showAvatarModal: boolean;
  uploadingAvatar: boolean;
  resendingVerification: boolean;
  verificationResent: boolean;
  verificationError: string | null;

  // Actions
  setActiveTab: (tab: string) => void;
  setShowAvatarModal: (show: boolean) => void;
  setUploadingAvatar: (uploading: boolean) => void;
  setVerificationResent: (resent: boolean) => void;
  setVerificationError: (error: string | null) => void;
  updateAvatar: (avatarUrl: string | null, onRefresh?: () => Promise<unknown>) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  resetVerificationState: () => void;
  resetProfileState: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  activeTab: 'settings',
  showAvatarModal: false,
  uploadingAvatar: false,
  resendingVerification: false,
  verificationResent: false,
  verificationError: null,

  setActiveTab: (activeTab: string) => set({ activeTab }),
  setShowAvatarModal: (showAvatarModal: boolean) => set({ showAvatarModal }),
  setUploadingAvatar: (uploadingAvatar: boolean) => set({ uploadingAvatar }),
  setVerificationResent: (verificationResent: boolean) => set({ verificationResent }),
  setVerificationError: (verificationError: string | null) => set({ verificationError }),

  updateAvatar: async (avatarUrl: string | null, onRefresh?: () => Promise<unknown>) => {
    set({ uploadingAvatar: true });
    try {
      const data = await api.patch<{ user?: UserProfile }>('/auth/profile', { avatarUrl });
      if (data?.user) {
        useAuthStore.getState().setUser(data.user);
      }
      if (onRefresh) {
        await onRefresh();
      }
    } finally {
      set({ uploadingAvatar: false });
    }
  },

  resendVerificationEmail: async (email: string) => {
    if (!email) return;
    set({
      resendingVerification: true,
      verificationResent: false,
      verificationError: null,
    });

    try {
      await api.post('/auth/resend-verification', { email });
      set({ verificationResent: true });
      setTimeout(() => {
        if (get().verificationResent) {
          set({ verificationResent: false });
        }
      }, 6000);
    } catch (err: any) {
      set({ verificationError: err?.message || 'Failed to resend verification email.' });
    } finally {
      set({ resendingVerification: false });
    }
  },

  resetVerificationState: () => {
    set({
      resendingVerification: false,
      verificationResent: false,
      verificationError: null,
    });
  },

  resetProfileState: () => {
    set({
      activeTab: 'settings',
      showAvatarModal: false,
      uploadingAvatar: false,
      resendingVerification: false,
      verificationResent: false,
      verificationError: null,
    });
  },
}));
