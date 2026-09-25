'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { ProfileSummaryCard } from '@/components/profile/profile-summary-card';
import { ProfileTabs } from '@/components/profile/profile-tabs';
import { AvatarModal } from '@/components/profile/avatar-modal';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'settings';

  const { user, isAuthenticated, isLoading, initialize, logout, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Avatar Modal State
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Email Verification Resend States
  const [resendingVerification, setResendingVerification] = useState(false);
  const [verificationResent, setVerificationResent] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/profile');
    }
  }, [isAuthenticated, isLoading, router]);

  // Synchronize latest profile data from backend on mount
  useEffect(() => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch((err) => {
        console.error('Failed to sync profile from backend:', err);
      });
  }, [setUser]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  // Update Avatar helper
  const handleUpdateAvatar = async (avatarUrl: string | null) => {
    setUploadingAvatar(true);
    const token = useAuthStore.getState().token;

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatarUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to update avatar.');
      }

      if (data?.user) {
        setUser(data.user);
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Resend email verification link for unverified account
  const handleResendVerificationEmail = async () => {
    if (!user?.email) return;
    setResendingVerification(true);
    setVerificationResent(false);
    setVerificationError(null);

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setVerificationError(data?.error || 'Failed to resend verification email.');
      } else {
        setVerificationResent(true);
        setTimeout(() => setVerificationResent(false), 6000);
      }
    } catch {
      setVerificationError('Unable to reach server. Please check your connection.');
    } finally {
      setResendingVerification(false);
    }
  };

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-500 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 space-y-8 animate-in fade-in duration-300">
      {/* Page Title & Description */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Manage your personal details, food orders, delivery addresses, and security settings.
        </p>
      </div>

      {/* Main Grid: 1-Column Left Summary + 2-Column Right Tabbed Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left Column: Profile Summary Card */}
        <ProfileSummaryCard
          user={user}
          onOpenAvatarModal={() => setShowAvatarModal(true)}
          uploadingAvatar={uploadingAvatar}
          onSignOut={handleSignOut}
          onResendVerification={handleResendVerificationEmail}
          resendingVerification={resendingVerification}
          verificationResent={verificationResent}
          verificationError={verificationError}
        />

        {/* Right Column: Tabbed Content Section */}
        <ProfileTabs
          user={user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Avatar Modal */}
      <AvatarModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        currentAvatarUrl={user.avatarUrl}
        onUpdateAvatar={handleUpdateAvatar}
        uploading={uploadingAvatar}
      />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-gray-500">Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
