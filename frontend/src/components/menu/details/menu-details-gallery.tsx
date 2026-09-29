'use client';

import React from 'react';
import Image from 'next/image';
import { Flame, Leaf } from 'lucide-react';
import { MenuItem } from '@/types/menu';

interface MenuDetailsGalleryProps {
  item: MenuItem;
}

export function MenuDetailsGallery({ item }: MenuDetailsGalleryProps) {
  return (
    <div className="w-full">
      {/* Main Image Showcase with ambient warm glow */}
      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-gray-200/80 dark:border-white/10 bg-gray-100 dark:bg-gray-800/80 shadow-md group">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🍲
          </div>
        )}

        {/* Dietary Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {item.isSpicy && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-red-400 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <span>Spicy</span>
            </span>
          )}
          {item.isVegetarian && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 text-xs font-bold">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Vegetarian</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
