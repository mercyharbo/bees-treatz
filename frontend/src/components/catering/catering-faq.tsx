'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { MOCK_CATERING_FAQS } from '@/mock/catering';

export function CateringFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-b border-gray-200/80 dark:border-white/10">
      <div className="text-center space-y-5 mb-16 lg:mb-20">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
          Everything You Need To Know
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
          Common questions about our Halal catering services, booking notice, and event logistics.
        </p>
      </div>

      <div className="space-y-4">
        {MOCK_CATERING_FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <Card
              key={idx}
              className="rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900/60 shadow-none overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                aria-expanded={isOpen}
              >
                <span className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-orange-600 shrink-0" />
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-orange-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-white/10 animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
