'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfile } from '@/hooks/queries';
import { api } from '@/lib/api';
import { ProfileSummaryCard } from '@/components/profile/profile-summary-card';
import { ProfileTabs } from '@/components/profile/profile-tabs';
import { AvatarModal } from '@/components/profile/avatar-modal';
import { ProfileSkeleton } from '@/components/profile/profile-skeleton';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'settings';

  const { user, isAuthenticated, isLoading, initialize, logout, setUser } = useAuthStore();
  const { user: profileData, mutate: mutateProfile } = useProfile();
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

  // Synchronize latest SWR profile data with store
  useEffect(() => {
    if (profileData) {
      setUser(profileData);
    }
  }, [profileData, setUser]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/profile');
    }
  }, [isAuthenticated, isLoading, router]);

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

  // Update Avatar using centralized api client
  const handleUpdateAvatar = async (avatarUrl: string | null) => {
    setUploadingAvatar(true);

    try {
      const data = await api.patch<{ user?: typeof user }>('/auth/profile', { avatarUrl });

      if (data?.user) {
        setUser(data.user);
        await mutateProfile();
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Resend email verification link using centralized api client
  const handleResendVerificationEmail = async () => {
    if (!user?.email) return;
    setResendingVerification(true);
    setVerificationResent(false);
    setVerificationError(null);

    try {
      await api.post('/auth/resend-verification', { email: user.email });
      setVerificationResent(true);
      setTimeout(() => setVerificationResent(false), 6000);
    } catch (err: any) {
      setVerificationError(err?.message || 'Failed to resend verification email.');
    } finally {
      setResendingVerification(false);
    }
  };

  if (isLoading || !isAuthenticated || !user) {
    return <ProfileSkeleton />;
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
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
