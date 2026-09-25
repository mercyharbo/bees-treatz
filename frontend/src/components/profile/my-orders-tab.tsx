'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MyOrdersTab() {
  return (
    <div className="space-y-6 outline-none">
      <div className="p-8 sm:p-12 text-center rounded-md border border-dashed border-gray-200 dark:border-white/15 bg-gray-50/50 dark:bg-gray-800/20 space-y-4">
        <div className="w-12 h-12 rounded-md bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            No Orders Placed Yet
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Hungry for authentic Nigerian jollof, savory meat pies, or spicy peppered beef? Order now and enjoy fresh delivery across London.
          </p>
        </div>
        <Button
          asChild
          className="rounded-md bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs px-5 h-9 shadow-none cursor-pointer"
        >
          <Link href="/#menu">Browse Delicious Menu</Link>
        </Button>
      </div>
    </div>
  );
}
