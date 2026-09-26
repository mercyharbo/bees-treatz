'use client';

import React from 'react';
import { ArrowRight, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CateringCtaBanner() {
  const scrollToForm = () => {
    const el = document.getElementById('inquiry-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden border border-gray-200/80 dark:border-white/10 bg-gradient-to-tr from-gray-950 via-gray-900 to-amber-950 text-white p-8 sm:p-14 lg:p-16 text-center space-y-6 shadow-xl shadow-gray-900/10">
        {/* Decorative ambient radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-5">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Ready To Plan Your Celebration?
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Let&apos;s Create Something Beautiful Together.
          </h2>

          <p className="text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            From intimate dinner parties in London to lavish 250-guest wedding banquets across the UK, Chef Bee is dedicated to delivering culinary excellence and breathtaking food styling.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              type="button"
              size="lg"
              onClick={scrollToForm}
              className="w-full sm:w-auto h-11 px-8 cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Request Bespoke Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-11 px-7 border-white/20 bg-white/10 hover:bg-white/20 text-white cursor-pointer flex items-center justify-center gap-2"
            >
              <a href="mailto:admin@beestreatz.co.uk?subject=Catering%20Inquiry%20-%20Bee's%20Treatz">
                <Mail className="w-4 h-4" />
                <span>Email Chef Bee</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
