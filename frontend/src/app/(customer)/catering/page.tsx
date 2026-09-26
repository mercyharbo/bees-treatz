'use client'

import { CateringCtaBanner } from '@/components/catering/catering-cta-banner'
import { CateringEventTypes } from '@/components/catering/catering-event-types'
import { CateringFaq } from '@/components/catering/catering-faq'
import { CateringHero } from '@/components/catering/catering-hero'
import { CateringInquiryForm } from '@/components/catering/catering-inquiry-form'
import { CateringMenuTabs } from '@/components/catering/catering-menu-tabs'
import { CateringPillars } from '@/components/catering/catering-pillars'
import { CateringStory } from '@/components/catering/catering-story'
import { CateringTestimonial } from '@/components/catering/catering-testimonial'
import { useState } from 'react'

export default function CateringPage() {
  const [selectedService, setSelectedService] = useState<string | undefined>(
    undefined,
  )
  const [selectedEventType, setSelectedEventType] = useState<
    string | undefined
  >(undefined)

  const handleSelectService = (service: string) => {
    setSelectedService(service)
  }

  const handleSelectEventType = (eventType: string) => {
    setSelectedEventType(eventType)
  }

  return (
    <div className='w-full space-y-0 animate-in fade-in duration-300'>
      {/* 1. Hero Section */}
      <CateringHero />

      {/* 2. Commitment to Quality & Editorial Story (01, 02, 03) */}
      <CateringStory />

      {/* 3. Three Core Specialties Showcase */}
      <CateringPillars onSelectService={handleSelectService} />

      {/* 4. Tabbed Catering Packages & Menus */}
      <CateringMenuTabs onSelectService={handleSelectService} />

      {/* 5. Event Types: Weddings, Corporate, Intimate */}
      <CateringEventTypes onSelectEventType={handleSelectEventType} />

      {/* 6. Client Experience / Testimonial */}
      <CateringTestimonial />

      {/* 7. Interactive Bespoke Quote Inquiry Form */}
      <CateringInquiryForm
        selectedService={selectedService}
        selectedEventType={selectedEventType}
      />

      {/* 8. Frequently Asked Questions Accordion */}
      <CateringFaq />

      {/* 9. Pre-Footer Callout Banner */}
      <CateringCtaBanner />
    </div>
  )
}
