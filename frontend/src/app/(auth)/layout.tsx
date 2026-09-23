import React from 'react';
import { FoodMosaic } from '@/components/auth/food-mosaic';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-gray-950">
      {/* Form Section */}
      <main className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 sm:p-10 lg:p-14 overflow-y-auto">
        <div className="w-full max-w-[440px] py-8">
          {children}
        </div>
      </main>

      {/* Food Mosaic Showcase (Attachment 1 & 2) */}
      <aside className="hidden lg:block lg:w-1/2 sticky top-0 h-screen overflow-hidden border-l border-gray-200/60 dark:border-gray-800">
        <FoodMosaic />
      </aside>
    </div>
  );
}
