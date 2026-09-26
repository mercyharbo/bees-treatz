'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function CateringTestimonial() {
  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-b border-gray-200/80 dark:border-white/10 text-center">
      <div className="space-y-4 mb-12 lg:mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
          Client Experiences
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
          What Our Clients Have To Say
        </h2>
      </div>

      <Card className="relative rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900/60 p-8 sm:p-14 shadow-none max-w-3xl mx-auto space-y-6">
        <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">
          <Quote className="w-6 h-6 fill-current" />
        </div>

        <div className="flex justify-center text-amber-500 gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
          ))}
        </div>

        <blockquote className="text-base sm:text-lg text-gray-800 dark:text-gray-200 font-medium leading-relaxed italic">
          &ldquo;Chef Bee and her team styled a magnificent 3-meter grazing table and Afro-fusion canapés for our wedding reception. Our guests could not stop taking photos — it was a true work of art! Knowing that every single bite was 100% Halal gave both our families complete peace of mind. Truly the best catering decision we made!&rdquo;
        </blockquote>

        <div className="pt-2">
          <div className="font-extrabold text-base text-gray-900 dark:text-white">
            Amina &amp; Farouq B.
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            London Wedding Reception · 160 Guests
          </div>
        </div>
      </Card>
    </section>
  );
}
