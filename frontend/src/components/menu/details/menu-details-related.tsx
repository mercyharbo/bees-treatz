'use client';

import React from 'react';
import { useMenu } from '@/hooks/useMenu';
import { MenuItemCard } from '../menu-item-card';

interface MenuDetailsRelatedProps {
  categoryId: string;
  currentItemId: string;
}

export function MenuDetailsRelated({
  categoryId,
  currentItemId,
}: MenuDetailsRelatedProps) {
  const { categories } = useMenu();

  // Pick pairings: first same category or complementary dishes
  const currentCategory = categories.find((c) => c.id === categoryId);
  const sameCategoryItems = currentCategory?.items.filter((item) => item.id !== currentItemId) || [];
  const otherItems = categories.filter((c) => c.id !== categoryId).flatMap((c) => c.items);
  
  const pairings = [...sameCategoryItems, ...otherItems].slice(0, 3);

  if (pairings.length === 0) return null;

  return (
    <section className="pt-10 mt-10 border-t border-gray-100 dark:border-white/10 space-y-5">
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
          Complete Your Order
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
          Recommended Pairings
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Pair your dish with fresh swallows, sides, or chilled drinks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pairings.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
