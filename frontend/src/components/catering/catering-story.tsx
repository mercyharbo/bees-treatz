'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOCK_CATERING_STORY_PILLARS } from '@/mock/catering';

export function CateringStory() {
  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-gray-200/80 dark:border-white/10">
      {/* Top 2-Column Header matching localdeli reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-16">
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
            Our Heritage &amp; Passion
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-[1.15]">
            We don&apos;t just cater events, we craft unforgettable culinary memories
          </h2>
        </div>
        <div className="lg:col-span-5 space-y-6 lg:pt-3">
          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            At Bee&apos;s Treatz, catering is an immersive sensory celebration. Founded by Chef Bee, we bring together the authentic, soulful depths of West African cuisine with contemporary British event food styling — 100% Halal certified.
          </p>
          <div>
            <Button variant="outline" asChild>
              <a href="#inquiry-form">
                Explore Event Catering
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Asymmetric 4-Photo Bento Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 mb-16">
        {/* Left Column: 1 Tall Vertical Hero Image */}
        <div className="md:col-span-5 relative h-[380px] md:h-[500px] rounded-2xl overflow-hidden border border-gray-200/80 dark:border-white/10 group">
          <Image
            src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1000&q=80"
            alt="Artisan grazing table by Bee's Treatz"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority
          />
        </div>

        {/* Right Column: 2 Top Images + 1 Wide Bottom Image */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <div className="relative h-[230px] rounded-2xl overflow-hidden border border-gray-200/80 dark:border-white/10 group">
            <Image
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
              alt="Afro-fusion canapés and gourmet small chops"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 30vw"
            />
          </div>
          <div className="relative h-[230px] rounded-2xl overflow-hidden border border-gray-200/80 dark:border-white/10 group">
            <Image
              src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80"
              alt="Mobile bar and signature cocktail service"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 30vw"
            />
          </div>
          <div className="sm:col-span-2 relative h-[246px] rounded-2xl overflow-hidden border border-gray-200/80 dark:border-white/10 group">
            <Image
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury wedding banquet celebration setup"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
        </div>
      </div>

      {/* 3 Numbered Feature Cards using Shadcn Card Primitives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_CATERING_STORY_PILLARS.map((item) => (
          <Card
            key={item.number}
            className="rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900/60 p-6 space-y-4 shadow-none"
          >
            <CardHeader className="p-0 space-y-2">
              <span className="text-3xl font-extrabold text-orange-600 dark:text-orange-400 font-mono">
                {item.number}
              </span>
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
