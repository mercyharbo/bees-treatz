'use client';

import React from 'react';
import { MenuItem } from '@/types/menu';
import { Clock, Flame, Leaf } from 'lucide-react';

interface MenuDetailsInfoProps {
  item: MenuItem;
}

export function MenuDetailsInfo({ item }: MenuDetailsInfoProps) {
  return (
    <div className="space-y-3 pb-2">
      {/* Category Eyebrow & Prep Time */}
      <div className="flex items-center justify-between gap-2">
        {item.category?.name ? (
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
            {item.category.name}
          </span>
        ) : (
          <span />
        )}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-[11px] font-semibold text-gray-700 dark:text-gray-300">
          <Clock className="w-3 h-3 text-orange-500" />
          <span>20-25 min</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        {item.name}
      </h1>

      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        {item.description}
      </p>

      {/* Dietary Tags */}
      {(item.isSpicy || item.isVegetarian) && (
        <div className="flex flex-wrap gap-2 pt-1">
          {item.isSpicy && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-500">
              <Flame className="w-3.5 h-3.5" />
              <span>Spicy Recipe</span>
            </span>
          )}
          {item.isVegetarian && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
              <Leaf className="w-3.5 h-3.5" />
              <span>Vegetarian Friendly</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
