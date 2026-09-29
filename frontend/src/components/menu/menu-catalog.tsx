'use client';

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMenu } from '@/hooks/useMenu';
import { useMenuStore } from '@/store/useMenuStore';
import { MenuSearchBar } from './menu-search-bar';
import { MenuCategoryTabs } from './menu-category-tabs';
import { MenuItemCard } from './menu-item-card';
import { MenuEmptyState } from './menu-empty-state';
import { DishCustomizerModal } from './dish-customizer-modal';

export function MenuCatalog() {
  const { categories, isLoading, error, refreshMenu } = useMenu();
  const activeSlug = useMenuStore((state) => state.activeCategorySlug);
  const searchQuery = useMenuStore((state) => state.searchQuery.toLowerCase());
  const dietaryFilter = useMenuStore((state) => state.dietaryFilter);

  const filteredCategories = categories
    .filter((cat) => activeSlug === 'all' || cat.slug === activeSlug)
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => {
        const matchesSearch =
          !searchQuery ||
          item.name.toLowerCase().includes(searchQuery) ||
          item.description.toLowerCase().includes(searchQuery);

        const matchesDietary =
          dietaryFilter === 'all' ||
          (dietaryFilter === 'spicy' && item.isSpicy) ||
          (dietaryFilter === 'vegetarian' && item.isVegetarian);

        return matchesSearch && matchesDietary;
      }),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Real-time Search & Dietary Filter */}
      <MenuSearchBar />

      {/* Category Navigation Tabs */}
      <MenuCategoryTabs categories={categories} />

      {/* Error Alert with Standardized Error Extraction */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center justify-between gap-4 mb-8 text-xs text-red-800 dark:text-red-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refreshMenu()}
            className="text-xs h-7 px-3 shrink-0"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-2xl bg-gray-100 dark:bg-gray-800"
            />
          ))}
        </div>
      )}

      {/* Empty Search/Filter Fallback */}
      {!isLoading && filteredCategories.length === 0 && <MenuEmptyState />}

      {/* Categorized Dish Grids */}
      {!isLoading && (
        <div className="space-y-14">
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="space-y-6">
              <div className="border-b border-gray-100 dark:border-white/10 pb-3">
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.items.map((dish) => (
                  <MenuItemCard key={dish.id} item={dish} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dish Customizer Modal */}
      <DishCustomizerModal />
    </section>
  );
}
