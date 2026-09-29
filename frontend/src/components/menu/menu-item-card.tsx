'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Flame, Leaf } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/types/menu';
import { useMenuStore } from '@/store/useMenuStore';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const openCustomizer = useMenuStore((state) => state.openCustomizer);

  const hasOptions = item.optionGroups && item.optionGroups.length > 0;

  return (
    <Card className="flex flex-col gap-0 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900/60 shadow-none overflow-hidden hover:border-orange-500/40 transition-all duration-300">
      {/* Dish Media */}
      <Link
        href={`/menu/${item.slug}`}
        className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-800 group"
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🍲
          </div>
        )}

        {/* Dietary Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
          {item.isSpicy && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-red-400 text-[10px] font-bold">
              <Flame className="w-3 h-3 text-red-400" />
              <span>Spicy</span>
            </span>
          )}
          {item.isVegetarian && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-emerald-400 text-[10px] font-bold">
              <Leaf className="w-3 h-3 text-emerald-400" />
              <span>Veg</span>
            </span>
          )}
        </div>
      </Link>

      {/* Dish Body */}
      <div className="px-4.5 pt-3 pb-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <Link
            href={`/menu/${item.slug}`}
            className="hover:text-orange-600 transition-colors inline-block"
          >
            <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
              {item.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">
              {hasOptions ? 'From' : 'Price'}
            </span>
            <span className="text-base font-extrabold text-gray-900 dark:text-white">
              £{item.basePrice.toFixed(2)}
            </span>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => openCustomizer(item)}
            className="text-xs font-semibold px-4 h-8.5 rounded-full cursor-pointer flex items-center gap-1.5 shadow-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{hasOptions ? 'Customize' : 'Add to Order'}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
