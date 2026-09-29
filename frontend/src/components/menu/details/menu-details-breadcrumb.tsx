'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface MenuDetailsBreadcrumbProps {
  categoryName?: string;
  dishName: string;
}

export function MenuDetailsBreadcrumb({
  categoryName,
  dishName,
}: MenuDetailsBreadcrumbProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-gray-100 dark:border-white/10">
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-orange-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/menu" className="hover:text-orange-600 transition-colors">
          Menu
        </Link>
        {categoryName && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              {categoryName}
            </span>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 dark:text-white font-bold truncate max-w-[200px] sm:max-w-xs">
          {dishName}
        </span>
      </nav>

      <Link
        href="/menu"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Menu</span>
      </Link>
    </div>
  );
}
