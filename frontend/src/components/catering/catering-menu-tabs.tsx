'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_CATERING_PACKAGES } from '@/mock/catering';
import { CateringCategory } from '@/types/catering';

interface CateringMenuTabsProps {
  onSelectService?: (serviceName: string) => void;
}

export function CateringMenuTabs({ onSelectService }: CateringMenuTabsProps) {
  const [activeTab, setActiveTab] = useState<CateringCategory | 'all'>('all');

  const filteredPackages =
    activeTab === 'all'
      ? MOCK_CATERING_PACKAGES
      : MOCK_CATERING_PACKAGES.filter((p) => p.category === activeTab);

  const tabs: { key: CateringCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'All Packages' },
    { key: 'grazing', label: 'Grazing Tables' },
    { key: 'canapes', label: 'Canapés & Small Chops' },
    { key: 'bar', label: 'Mobile Bar & Drinks' },
    { key: 'bowls', label: 'Food & Soup Bowls' },
  ];

  const handleSelect = (serviceKey: string) => {
    if (onSelectService) {
      onSelectService(serviceKey);
    }
    const form = document.getElementById('inquiry-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="catering-packages"
      className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-gray-200/80 dark:border-white/10"
    >
      {/* Header with generous spacing and clean typography */}
      <div className="space-y-5 max-w-3xl mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
          Exceptional Catering For Every Occasion
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Catering Packages &amp; Menus
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          All catering orders require at least 48 hours notice. For weddings &amp; large galas, please book 2–4 weeks ahead.
        </p>
      </div>

      {/* Category Tabs Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-gray-200/80 dark:border-white/10 mb-10 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer rounded',
              activeTab === tab.key
                ? 'bg-orange-600 text-white shadow-none'
                : 'bg-gray-100 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Packages Grid: Full-bleed visual cards matching localdeli reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => handleSelect(pkg.serviceKey)}
            className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer border border-gray-200/60 dark:border-white/10 shadow-sm transition-all duration-500 hover:shadow-xl"
          >
            {/* Background Image */}
            <Image
              src={pkg.image}
              alt={pkg.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Pinned Bottom Content */}
            <div className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-end text-white space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-orange-400">
                  {pkg.tag || pkg.serves}
                </span>
                <span className="text-xs font-semibold text-gray-300">
                  {pkg.serves}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                {pkg.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed">
                {pkg.description}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-white/15">
                <span className="text-sm font-extrabold text-white">
                  {pkg.price}
                </span>

                <div className="w-9 h-9 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
