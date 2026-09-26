'use client'

import { MOCK_CATERING_PILLARS } from '@/mock/catering'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

interface CateringPillarsProps {
  onSelectService?: (serviceName: string) => void
}

export function CateringPillars({ onSelectService }: CateringPillarsProps) {
  const handleSelect = (serviceKey: string) => {
    if (onSelectService) {
      onSelectService(serviceKey)
    }
    const form = document.getElementById('inquiry-form')
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className='py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-gray-200/80 dark:border-white/10'>
      <div className='text-center max-w-3xl mx-auto space-y-5 mb-16 lg:mb-20'>
        <span className='text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400'>
          Our Core Specialties
        </span>
        <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight'>
          Three Signature Catering Experiences
        </h2>
        <p className='text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed'>
          Choose a single bespoke service or combine grazing tables, gourmet
          canapés, and our mobile bar for a fully styled event.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8'>
        {MOCK_CATERING_PILLARS.map((svc) => (
          <div
            key={svc.id}
            onClick={() => handleSelect(svc.serviceKey)}
            className='group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer border border-gray-200/60 dark:border-white/10 shadow-sm transition-all duration-500 hover:shadow-xl'
          >
            {/* Background Image */}
            <Image
              src={svc.image}
              alt={svc.title}
              fill
              className='object-cover transition-transform duration-700 group-hover:scale-105'
              sizes='(max-width: 768px) 100vw, 33vw'
            />

            {/* Dark Vignette Overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent' />

            {/* Content pinned to bottom */}
            <div className='absolute inset-0 p-6 sm:p-7 flex flex-col justify-end text-white space-y-3'>
              <span className='text-[11px] font-bold uppercase tracking-widest text-orange-400'>
                {svc.tag}
              </span>

              <h3 className='text-xl sm:text-2xl font-bold leading-snug'>
                {svc.title}
              </h3>

              <p className='text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed'>
                {svc.description}
              </p>

              <div className='pt-2 flex items-center justify-between border-t border-white/15'>
                <span className='text-xs font-semibold text-gray-200'>
                  {svc.price}
                </span>

                <div className='w-9 h-9 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white'>
                  <ArrowUpRight className='w-4 h-4' />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
