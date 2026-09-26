'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Star, UtensilsCrossed, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CateringHero() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-32 sm:pt-40 pb-20 lg:pb-28 px-4 sm:px-6 lg:px-8 border-b border-gray-200/80 dark:border-white/10 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 text-center relative z-10">
        {/* Top Tagline: Clean uppercase typography (NO pill, NO sparkles) */}
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
          London &amp; UK Nationwide · 100% Halal Certified Event Catering
        </p>

        {/* Main Title & Editorial Subhead with generous spacing */}
        <div className="space-y-5 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.12]">
            Luxury Event Catering &amp;{' '}
            <span className="text-orange-600 dark:text-orange-500">
              Bespoke Food Styling
            </span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed pt-1">
            Elevating weddings, corporate gatherings, and intimate celebrations with show-stopping Halal grazing tables, gourmet Afro-fusion canapés, and bespoke mobile bar experiences.
          </p>
        </div>

        {/* Dual Call-to-Action Buttons (NO rounded-md, NO gradient) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Button
            type="button"
            size="lg"
            onClick={() => scrollToSection('inquiry-form')}
            className="w-full sm:w-auto h-11 px-8 text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Request Bespoke Quote</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => scrollToSection('catering-packages')}
            className="w-full sm:w-auto h-11 px-7 text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Explore Catering Packages</span>
          </Button>
        </div>

        {/* Clean Rating Row (NO pill container, NO green pill) */}
        <div className="pt-4 flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
            ))}
          </div>
          <span className="font-extrabold text-gray-900 dark:text-white">4.9 / 5</span>
          <span className="text-gray-400">·</span>
          <span className="font-medium text-gray-600 dark:text-gray-300">Over 50+ Luxury Events Catered Across the UK</span>
        </div>

        {/* Hero Visual Banner */}
        <div className="pt-8">
          <div className="relative w-full aspect-[16/8] sm:aspect-[21/9] rounded-xl overflow-hidden border border-gray-200/80 dark:border-white/10 shadow-xl shadow-gray-900/5">
            <Image
              src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1600&q=80"
              alt="Bee's Treatz Luxury Food Styling & Halal Grazing Table"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent" />
            
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 text-left space-y-1">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-400">
                Signature Food Styling
              </span>
              <p className="text-white text-base sm:text-xl font-extrabold">
                Bespoke Grazing Tables · Custom Florals · Afro-Fusion Canapés
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
