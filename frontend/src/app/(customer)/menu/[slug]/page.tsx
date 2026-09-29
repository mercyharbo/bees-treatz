'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMenuItem } from '@/hooks/useMenu';
import { MenuDetailsBreadcrumb } from '@/components/menu/details/menu-details-breadcrumb';
import { MenuDetailsGallery } from '@/components/menu/details/menu-details-gallery';
import { MenuDetailsInfo } from '@/components/menu/details/menu-details-info';
import { MenuDetailsOptions } from '@/components/menu/details/menu-details-options';
import { MenuDetailsRelated } from '@/components/menu/details/menu-details-related';
import { DishCustomizerModal } from '@/components/menu/dish-customizer-modal';

interface MenuDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default function MenuDetailsPage({ params }: MenuDetailsPageProps) {
  const { slug } = use(params);
  const { item, isLoading, error, refreshItem } = useMenuItem(slug);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20 space-y-8 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7 aspect-[4/3] bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-md" />
            <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-md" />
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-md" />
            <div className="h-24 w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-xl mx-auto px-4 pt-32 pb-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
          Item Not Found
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {error || "We couldn't find the menu item you're looking for."}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => refreshItem()}
            className="text-xs font-semibold gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </Button>
          <Link href="/menu">
            <Button type="button" className="text-xs font-semibold gap-2 cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Menu</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20 space-y-10 animate-in fade-in duration-300">
      <MenuDetailsBreadcrumb
        categoryName={item.category?.name}
        dishName={item.name}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Gallery & Allergens */}
        <div className="lg:col-span-6 xl:col-span-7">
          <MenuDetailsGallery item={item} />
        </div>

        {/* Right Column: Culinary Info & Customization Card */}
        <div className="lg:col-span-6 xl:col-span-5 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900/70 backdrop-blur-md p-6 sm:p-7 shadow-sm lg:sticky lg:top-28">
          <MenuDetailsInfo item={item} />
          <MenuDetailsOptions item={item} />
        </div>
      </div>

      {/* Recommended Pairings */}
      <MenuDetailsRelated
        categoryId={item.categoryId}
        currentItemId={item.id}
      />

      {/* Modal for related items customized in place */}
      <DishCustomizerModal />
    </div>
  );
}
