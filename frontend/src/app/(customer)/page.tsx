'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame, Sparkles, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section matching Attachment 3 vibe */}
      <section className="relative min-h-[90vh] flex items-center justify-center -mt-20 pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-background text-white">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=80"
            alt="Authentic Naija Cuisine"
            fill
            priority
            className="object-cover opacity-25 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-gray-950/60 to-black/80" />
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-amber-400 shadow-sm animate-in fade-in duration-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Authentic Nigerian Kitchen in the UK 🇬🇧</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
            Taste The Rich Flavours Of <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">Home</span>.
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Slow-cooked Egusi, firewood-style Party Jollof, spicy Suya skewers, and chilled Chapman. Handcrafted fresh and delivered to your doorstep.
          </p>

          {/* Action Buttons using shadcn Button with asChild */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Button
              asChild
              variant="default"
              className="w-full sm:w-auto h-12 px-7 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-gray-950 font-bold text-sm sm:text-base shadow-lg shadow-orange-500/25 border-none"
            >
              <Link href="/register">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto h-12 px-7 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border-white/20 backdrop-blur-md transition-colors"
            >
              <Link href="/#menu">
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                <span>Explore Menu</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Menu Teaser Section */}
      <section id="menu" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b pb-6">
          <div>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-500">
              Fresh From Our Kitchen
            </span>
            <h2 className="text-3xl font-extrabold mt-1">Our Signature Specialties</h2>
          </div>
          <Button asChild variant="outline" className="rounded-full text-xs font-semibold px-4 h-8">
            <Link href="/login">
              <span>Sign In To Order</span>
            </Link>
          </Button>
        </div>

        {/* Dish Showcase Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {[
            {
              title: 'Smoky Party Jollof',
              description: 'Cooked with plum tomatoes, red peppers, bay leaves, and slow-roasted beef stock.',
              price: '£12.50',
              image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80',
              tag: 'Best Seller',
            },
            {
              title: 'Pounded Yam & Egusi Soup',
              description: 'Ground melon seed stew simmered with bitterleaf, assorted meat, and smoked fish.',
              price: '£16.00',
              image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
              tag: 'Chef Favorite',
            },
            {
              title: 'Flame-Grilled Suya Skewers',
              description: 'Tender sirloin strips marinated in authentic yaji spice, served with sliced red onions.',
              price: '£11.00',
              image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
              tag: 'Spicy',
            },
          ].map((dish, idx) => (
            <div
              key={idx}
              className="group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-card hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <Image
                  src={dish.image}
                  alt={dish.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-gray-950/80 backdrop-blur-md text-amber-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500" />
                  {dish.tag}
                </span>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{dish.title}</h3>
                  <span className="font-extrabold text-orange-600 dark:text-orange-400">{dish.price}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {dish.description}
                </p>
                <div className="pt-2">
                  <Button asChild variant="secondary" className="w-full rounded-xl text-xs font-semibold h-9">
                    <Link href="/register">
                      <span>Order This Dish</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
