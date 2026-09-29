'use client';

import React from 'react';
import { Category } from '@/types/menu';
import { useMenuStore } from '@/store/useMenuStore';
import { cn } from '@/lib/utils';

interface MenuCategoryTabsProps {
  categories: Category[];
}

export function MenuCategoryTabs({ categories }: MenuCategoryTabsProps) {
  const activeSlug = useMenuStore((state) => state.activeCategorySlug);
  const setActiveSlug = useMenuStore((state) => state.setActiveCategorySlug);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-gray-200/80 dark:border-white/10 mb-8 scrollbar-none">
      <button
        type="button"
        onClick={() => setActiveSlug('all')}
        className={cn(
          'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
          activeSlug === 'all'
            ? 'bg-orange-600 text-white shadow-none'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
        )}
      >
        All Categories
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => setActiveSlug(cat.slug)}
          className={cn(
            'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
            activeSlug === cat.slug
              ? 'bg-orange-600 text-white shadow-none'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
