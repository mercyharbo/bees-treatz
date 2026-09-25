import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProfileSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 space-y-8 animate-in fade-in duration-300">
      {/* Page Title & Description Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 sm:w-60 rounded-md" />
        <Skeleton className="h-4 w-72 sm:w-96 rounded-md" />
      </div>

      {/* Main Grid: 1-Column Left Summary + 2-Column Right Tabbed Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left Column: Profile Summary Card Skeleton */}
        <Card className="lg:col-span-1 rounded-md border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900/60 shadow-none overflow-hidden p-6 sm:p-7 space-y-6 text-center">
          {/* Avatar Skeleton */}
          <div className="mx-auto flex justify-center">
            <Skeleton className="size-24 sm:size-28 rounded-full" />
          </div>

          {/* User Name & Details Skeleton */}
          <div className="space-y-2 flex flex-col items-center">
            <Skeleton className="h-6 w-36 rounded-md" />
            <Skeleton className="h-3.5 w-48 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md mt-1" />
          </div>

          {/* Badge Skeleton */}
          <div className="flex justify-center">
            <Skeleton className="h-6 w-32 rounded-md" />
          </div>

          {/* Summary Stats Rows Skeleton */}
          <div className="divide-y divide-gray-100 dark:divide-white/10 border-y border-gray-100 dark:border-white/10 py-1 space-y-2.5">
            <div className="pt-2.5 flex items-center justify-between">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-4 w-8 rounded-md" />
            </div>
            <div className="pt-2.5 flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-8 rounded-md" />
            </div>
            <div className="pt-2.5 flex items-center justify-between">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-4 w-12 rounded-md" />
            </div>
          </div>

          {/* Quick Action Buttons Skeleton */}
          <div className="space-y-2.5 pt-1">
            <Skeleton className="w-full h-10 rounded-md" />
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
        </Card>

        {/* Right Column: Tabbed Content Section Skeleton */}
        <Card className="lg:col-span-2 rounded-md border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900/60 shadow-none overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Tabs Header Skeleton */}
          <div className="border-b border-gray-200 dark:border-white/10 pb-3 flex items-center gap-4 sm:gap-8 overflow-x-auto">
            <Skeleton className="h-5 w-28 rounded-md shrink-0" />
            <Skeleton className="h-5 w-20 rounded-md shrink-0" />
            <Skeleton className="h-5 w-28 rounded-md shrink-0" />
            <Skeleton className="h-5 w-16 rounded-md shrink-0" />
          </div>

          {/* Form Fields Skeleton (mirrors Account Settings) */}
          <div className="space-y-5 pt-2">
            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>

            {/* Street Address */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* State, City, Postcode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>

            {/* Submit Button Skeleton */}
            <div className="pt-2">
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
