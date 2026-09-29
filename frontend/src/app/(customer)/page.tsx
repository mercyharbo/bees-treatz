'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuCatalog } from '@/components/menu/menu-catalog';

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center -mt-20 pt-36 sm:pt-44 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-950 text-white">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=80"
            alt="Authentic Naija Cuisine"
            fill
            priority
            className="object-cover opacity-35 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/90" />
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-amber-400 shadow-sm animate-in fade-in duration-500">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Authentic Nigerian Kitchen in the UK 🇬🇧</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
            Taste The Rich Flavours Of <span className="text-orange-500">Home</span>.
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Slow-cooked Egusi, firewood-style Party Jollof, spicy Suya skewers, and chilled Chapman. Handcrafted fresh and delivered to your doorstep.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Button
              asChild
              variant="default"
              className="w-full sm:w-auto h-12 px-8 font-bold text-sm sm:text-base border-none rounded-full cursor-pointer shadow-none"
            >
              <Link href="/register">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border-white/20 backdrop-blur-md transition-colors cursor-pointer"
            >
              <a href="#menu">
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                <span>Explore Menu</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Full Interactive Menu Catalog directly on Index */}
      <MenuCatalog />
    </div>
  );
}
