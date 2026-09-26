'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Heart, Building2, Users2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOCK_CATERING_EVENT_TYPES } from '@/mock/catering';

interface CateringEventTypesProps {
  onSelectEventType?: (eventType: string) => void;
}

const EVENT_ICONS: Record<string, React.ElementType> = {
  Wedding: Heart,
  'Corporate Event': Building2,
  'Intimate Gathering': Users2,
};

export function CateringEventTypes({ onSelectEventType }: CateringEventTypesProps) {
  const handleSelect = (eventVal: string) => {
    if (onSelectEventType) {
      onSelectEventType(eventVal);
    }
    const form = document.getElementById('inquiry-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-gray-200/80 dark:border-white/10">
      <div className="text-center max-w-3xl mx-auto space-y-5 mb-16 lg:mb-20">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
          Tailored Hospitality
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Catering for Every Milestone
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
          From grand traditional wedding receptions across the UK to intimate family gatherings in London.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {MOCK_CATERING_EVENT_TYPES.map((evt, idx) => {
          const Icon = EVENT_ICONS[evt.eventVal] || Heart;
          return (
            <Card
              key={idx}
              className="flex flex-col rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900/60 shadow-none overflow-hidden hover:border-orange-500/40 transition-all duration-300"
            >
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={evt.image}
                  alt={evt.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-950/80 backdrop-blur-md p-2 rounded-xl text-orange-600 dark:text-orange-400">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 block tracking-wide">
                    {evt.subtitle}
                  </span>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {evt.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {evt.badge}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleSelect(evt.eventVal)}
                    className="text-xs font-semibold h-8 px-3 cursor-pointer"
                  >
                    <span>Inquire</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
