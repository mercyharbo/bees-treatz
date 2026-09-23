'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FoodMosaic } from '@/components/auth/food-mosaic';
import { useAuthStore } from '@/store/useAuthStore';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/profile');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gray-50/70 dark:bg-gray-950">
      {/* Form Section */}
      <main className="relative w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 sm:p-10 lg:p-14 overflow-y-auto">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-[440px] py-8">
          {children}
        </div>
      </main>

      {/* Food Mosaic Showcase (Attachment 1 & 2) */}
      <aside className="hidden lg:block lg:w-1/2 sticky top-0 h-screen overflow-hidden border-l border-gray-200/80 dark:border-white/10">
        <FoodMosaic />
      </aside>
    </div>
  );
}
