'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  AlertCircle,
  ShoppingBag,
  LogOut,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, initialize, logout } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/profile');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSignOut = () => {
    logout();
    router.push('/login');
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

  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 animate-in fade-in duration-300">
      {/* Profile Header Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 dark:from-black dark:via-gray-950 dark:to-gray-900 p-6 sm:p-10 text-white shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar Initial */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white text-3xl sm:text-4xl font-extrabold shadow-lg shadow-orange-500/20 shrink-0">
            {initial}
          </div>

          {/* User Info */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {user.name}
              </h1>
              {user.isEmailVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Unverified
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-300">
              {user.email}
            </p>
            <p className="text-xs text-gray-400">
              Customer Account • Bee&apos;s Treatz Member
            </p>
          </div>

          {/* Sign Out Action Button */}
          <div className="pt-2 sm:pt-0">
            <Button
              type="button"
              onClick={handleSignOut}
              variant="outline"
              className="rounded-full bg-white/10 hover:bg-red-500/20 text-white hover:text-red-300 border-white/20 hover:border-red-500/30 text-xs font-medium px-4 h-9 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Unverified Email Warning Banner */}
      {!user.isEmailVerified && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs text-amber-800 dark:text-amber-300">
              <p className="font-semibold">Please verify your email address</p>
              <p>A confirmation email has been dispatched to keep your account safe.</p>
            </div>
          </div>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 h-8 shrink-0 cursor-pointer"
          >
            <Link href={`/verify-email?email=${encodeURIComponent(user.email)}`}>
              Verify Now
            </Link>
          </Button>
        </div>
      )}

      {/* Main Grid: Account Info & Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-gray-800">
            <User className="w-4 h-4 text-orange-500" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Personal Information
            </h2>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-gray-400 block pb-0.5">Full Name</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
            </div>

            <div>
              <span className="text-gray-400 block pb-0.5">Email Address</span>
              <span className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                {user.email}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block pb-0.5">Phone Number</span>
              <span className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                {user.phone || 'Not provided'}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block pb-0.5">Account Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active Customer
              </span>
            </div>
          </div>
        </div>

        {/* Orders & Quick Actions Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-gray-800">
              <ShoppingBag className="w-4 h-4 text-orange-500" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Orders & Ordering
              </h2>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Explore authentic Nigerian dishes, savory pastries, fresh jollof, and succulent grills prepared fresh in London.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Button
              asChild
              className="w-full rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs h-10 shadow-sm cursor-pointer"
            >
              <Link href="/#menu" className="flex items-center justify-center gap-2">
                <span>Browse Full Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full rounded-xl border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-semibold h-10 cursor-pointer"
            >
              <Link href="/checkout">
                View Current Cart
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
