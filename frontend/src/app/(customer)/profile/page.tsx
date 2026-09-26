'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useProfile } from '@/hooks/queries';
import { api } from '@/lib/api';
import { ProfileSummaryCard } from '@/components/profile/profile-summary-card';
import { ProfileTabs } from '@/components/profile/profile-tabs';
import { AvatarModal } from '@/components/profile/avatar-modal';
import { ProfileSkeleton } from '@/components/profile/profile-skeleton';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { logout } = useAuthStore();
  const { user, loading, mutate: refreshProfile } = useProfile();

  const {
    activeTab,
    setActiveTab,
    showAvatarModal,
    setShowAvatarModal,
    uploadingAvatar,
    resendingVerification,
    verificationResent,
    verificationError,
    updateAvatar,
    resendVerificationEmail,
  } = useProfileStore();

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams, setActiveTab]);

  const handleSignOut = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Continue client logout even if backend fails
    }
    logout();
    router.push('/');
  };

  // Update Avatar using store action and SWR revalidation
  const handleUpdateAvatar = async (avatarUrl: string | null) => {
    await updateAvatar(avatarUrl, refreshProfile);
  };

  // Resend email verification link using store action
  const handleResendVerificationEmail = async () => {
    if (!user?.email) return;
    await resendVerificationEmail(user.email);
  };

  // Pure SWR loading check for skeleton
  if (loading || !user) {
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
          onProfileUpdated={async () => {
            await refreshProfile();
          }}
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
