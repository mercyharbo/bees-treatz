'use client';

import React from 'react';
import { CateringHero } from '@/components/catering/catering-hero';
import { CateringStory } from '@/components/catering/catering-story';
import { CateringPillars } from '@/components/catering/catering-pillars';
import { CateringMenuTabs } from '@/components/catering/catering-menu-tabs';
import { CateringEventTypes } from '@/components/catering/catering-event-types';
import { CateringTestimonial } from '@/components/catering/catering-testimonial';
import { CateringInquiryForm } from '@/components/catering/catering-inquiry-form';
import { CateringFaq } from '@/components/catering/catering-faq';
import { CateringCtaBanner } from '@/components/catering/catering-cta-banner';

export default function CateringPage() {
  return (
    <div className="w-full space-y-0 animate-in fade-in duration-300">
      {/* 1. Hero Section */}
      <CateringHero />

      {/* 2. Commitment to Quality & Editorial Story (01, 02, 03) */}
      <CateringStory />

      {/* 3. Three Core Specialties Showcase */}
      <CateringPillars />

      {/* 4. Tabbed Catering Packages & Menus */}
      <CateringMenuTabs />

      {/* 5. Event Types: Weddings, Corporate, Intimate */}
      <CateringEventTypes />

      {/* 6. Client Experience / Testimonial */}
      <CateringTestimonial />

      {/* 7. Interactive Bespoke Quote Inquiry Form */}
      <CateringInquiryForm />

      {/* 8. Frequently Asked Questions Accordion */}
      <CateringFaq />

      {/* 9. Pre-Footer Callout Banner */}
      <CateringCtaBanner />
    </div>
  );
}
