'use client';

import React from 'react';

export function MenuHero() {
  return (
    <section className="relative overflow-hidden pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200/80 dark:border-white/10 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-5 text-center relative z-10">
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
          London &amp; UK Nationwide · 100% Halal Certified Kitchen
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.12]">
          Artisan Food &amp;{' '}
          <span className="text-orange-600 dark:text-orange-500">
            Soup Bowls
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Order slow-cooked family soup tubs, firewood-style Party Jollof trays, flame-grilled suya, and chilled mocktails delivered straight to your door.
        </p>
      </div>
    </section>
  );
}
