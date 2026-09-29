'use client';

import React from 'react';
import { ShieldCheck, HeartHandshake } from 'lucide-react';

export function MenuHalalBanner() {
  return (
    <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 dark:bg-orange-500/10 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-600/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
            100% Certified Halal Kitchen
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            All beef, poultry, lamb, and pantry ingredients are strictly sourced from certified UK Halal suppliers.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 shrink-0">
        <HeartHandshake className="w-4 h-4 text-orange-600 dark:text-orange-400" />
        <span>Natasha&apos;s Law Compliant</span>
      </div>
    </div>
  );
}
