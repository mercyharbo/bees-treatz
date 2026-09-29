'use client';

import React from 'react';
import { Search, X, Flame, Leaf } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMenuStore } from '@/store/useMenuStore';
import { cn } from '@/lib/utils';

export function MenuSearchBar() {
  const searchQuery = useMenuStore((state) => state.searchQuery);
  const setSearchQuery = useMenuStore((state) => state.setSearchQuery);
  const dietaryFilter = useMenuStore((state) => state.dietaryFilter);
  const setDietaryFilter = useMenuStore((state) => state.setDietaryFilter);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by dish name (e.g. Egusi, Jollof, Suya)..."
          className="pl-10 pr-9 text-xs sm:text-sm h-10 rounded-xl"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dietary Quick Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        <button
          type="button"
          onClick={() => setDietaryFilter('all')}
          className={cn(
            'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer',
            dietaryFilter === 'all'
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
          )}
        >
          All Dishes
        </button>

        <button
          type="button"
          onClick={() =>
            setDietaryFilter(dietaryFilter === 'spicy' ? 'all' : 'spicy')
          }
          className={cn(
            'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5',
            dietaryFilter === 'spicy'
              ? 'bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
          )}
        >
          <Flame className="w-3.5 h-3.5 text-red-500" />
          <span>Spicy</span>
        </button>

        <button
          type="button"
          onClick={() =>
            setDietaryFilter(
              dietaryFilter === 'vegetarian' ? 'all' : 'vegetarian'
            )
          }
          className={cn(
            'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5',
            dietaryFilter === 'vegetarian'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
          )}
        >
          <Leaf className="w-3.5 h-3.5 text-emerald-500" />
          <span>Vegetarian</span>
        </button>
      </div>
    </div>
  );
}
