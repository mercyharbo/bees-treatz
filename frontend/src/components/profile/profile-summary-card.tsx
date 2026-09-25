'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertCircle,
  Camera,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import { UserProfile } from '@/types/auth';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProfileSummaryCardProps {
  user: UserProfile;
  onOpenAvatarModal: () => void;
  uploadingAvatar: boolean;
  onSignOut: () => void;
  onResendVerification: () => Promise<void>;
  resendingVerification: boolean;
  verificationResent: boolean;
  verificationError: string | null;
}

export function ProfileSummaryCard({
  user,
  onOpenAvatarModal,
  uploadingAvatar,
  onSignOut,
  onResendVerification,
  resendingVerification,
  verificationResent,
  verificationError,
}: ProfileSummaryCardProps) {
  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <Card className="lg:col-span-1 rounded-md border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900/60 dark:backdrop-blur-xl shadow-none overflow-hidden p-6 sm:p-7 space-y-6 text-center">
      {/* Circular Avatar with Camera overlay */}
      <div className="relative inline-block mx-auto">
        <Avatar className="size-24 sm:size-28 ring-4 ring-orange-500/20">
          {user.avatarUrl && (
            <AvatarImage src={user.avatarUrl} alt={user.name} />
          )}
          <AvatarFallback className="bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-extrabold text-3xl sm:text-4xl">
            {initial}
          </AvatarFallback>
        </Avatar>

        {/* Email Verified Badge on top-right */}
        {user.isEmailVerified && (
          <div
            className="absolute top-0 right-0 bg-emerald-500 text-white rounded-full p-1 shadow-none ring-2 ring-white dark:ring-gray-900"
            title="Verified Customer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Camera Button on bottom-right */}
        <button
          type="button"
          onClick={onOpenAvatarModal}
          disabled={uploadingAvatar}
          className="absolute bottom-0 right-0 p-2 rounded-full bg-orange-600 hover:bg-orange-500 text-white shadow-none ring-2 ring-white dark:ring-gray-900 transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
          title="Change Profile Avatar"
          aria-label="Change Profile Avatar"
        >
          {uploadingAvatar ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* User Name & Details */}
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
          {user.name}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {user.email}
        </p>
        <button
          type="button"
          onClick={onOpenAvatarModal}
          className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-semibold pt-1 cursor-pointer inline-block"
        >
          {user.avatarUrl ? 'Change Avatar' : '+ Add Avatar Photo'}
        </button>
      </div>

      {/* Verification Badge */}
      <div className="flex justify-center">
        {user.isEmailVerified ? (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 gap-1.5 px-3 py-1 text-xs font-semibold rounded-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Account
          </Badge>
        ) : (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 gap-1.5 px-3 py-1 text-xs font-semibold rounded-md">
            <AlertCircle className="w-3.5 h-3.5" />
            Unverified Email
          </Badge>
        )}
      </div>

      {/* Unverified Action Banner */}
      {!user.isEmailVerified && (
        <div className="p-3.5 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 space-y-2.5 text-left">
          <p className="font-semibold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            Verify your email address
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
            Confirm your email to unlock all loyalty perks and order tracking updates.
          </p>

          {verificationResent && (
            <div className="p-2 rounded-md bg-emerald-100/70 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Verification link sent to your inbox!</span>
            </div>
          )}

          {verificationError && (
            <div className="p-2 rounded-md bg-red-100/70 dark:bg-red-950/50 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 text-[11px] font-semibold flex items-center gap-1.5 animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600 dark:text-red-400" />
              <span>{verificationError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              asChild
              size="sm"
              className="rounded-md bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs h-8 cursor-pointer shadow-none"
            >
              <Link href={`/verify-email?email=${encodeURIComponent(user.email)}`}>
                Verify Now
              </Link>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onResendVerification}
              disabled={resendingVerification}
              className="rounded-md border-amber-300 dark:border-amber-700 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 text-amber-900 dark:text-amber-200 font-semibold text-xs h-8 cursor-pointer disabled:opacity-50"
            >
              {resendingVerification ? 'Sending...' : 'Resend Link'}
            </Button>
          </div>
        </div>
      )}

      {/* Summary Stats Rows */}
      <div className="divide-y divide-gray-100 dark:divide-white/10 border-y border-gray-100 dark:border-white/10 py-1 text-xs text-left">
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400">Total Orders</span>
          <span className="font-bold text-gray-900 dark:text-white">0</span>
        </div>
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400">Saved Favorites</span>
          <span className="font-bold text-gray-900 dark:text-white">0</span>
        </div>
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400">Treatz Points</span>
          <span className="font-bold text-orange-600 dark:text-orange-400">50 pts</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2.5 pt-1">
        <Button
          asChild
          className="w-full rounded-md bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs h-10 shadow-none cursor-pointer"
        >
          <Link href="/#menu">Browse Menu</Link>
        </Button>
        <Button
          type="button"
          onClick={onSignOut}
          variant="outline"
          className="w-full rounded-md border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold h-10 cursor-pointer flex items-center justify-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </Button>
      </div>
    </Card>
  );
}
