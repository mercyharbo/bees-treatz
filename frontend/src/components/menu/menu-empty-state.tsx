'use client';

import React from 'react';
import { UtensilsCrossed, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMenuStore } from '@/store/useMenuStore';

export function MenuEmptyState() {
  const resetFilters = useMenuStore((state) => state.resetFilters);

  return (
    <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 my-8 space-y-4">
      <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">
        <UtensilsCrossed className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-bold text-gray-900 dark:text-white">
          No Dishes Found
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          We couldn&apos;t find any dishes matching your current search or dietary filters.
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={resetFilters}
        className="text-xs cursor-pointer inline-flex items-center gap-1.5"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset Filters</span>
      </Button>
    </div>
  );
}
