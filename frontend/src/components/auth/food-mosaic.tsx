import React from 'react';
import Image from 'next/image';

const FOOD_ITEMS = [
  {
    src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh gourmet bowl',
  },
  {
    src: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
    alt: 'Wood-fired gourmet dish',
  },
  {
    src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    alt: 'Signature salad plate',
  },
  {
    src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
    alt: 'Sizzling pan stew',
  },
  {
    src: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    alt: 'Gourmet appetizer',
  },
  {
    src: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80',
    alt: 'Authentic jollof rice style skillet',
  },
  {
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    alt: 'Chef seasoned cuisine',
  },
  {
    src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    alt: 'Platter service presentation',
  },
  {
    src: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    alt: 'Golden fried bite-sized specialties',
  },
  {
    src: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    alt: 'Suya skewers & fresh grill',
  },
  {
    src: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80',
    alt: 'Hearty kitchen broth bowl',
  },
  {
    src: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=600&q=80',
    alt: 'Rich savory African entree platter',
  },
];

export function FoodMosaic() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-950 p-3.5 sm:p-4 lg:p-5 xl:p-6 select-none flex flex-col">
      <div className="grid grid-cols-3 grid-rows-4 gap-2.5 sm:gap-3 lg:gap-3.5 h-full w-full">
        {FOOD_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="relative min-h-0 w-full h-full overflow-hidden rounded-2xl bg-gray-900 shadow-md group transition-transform duration-500 hover:scale-[1.02]"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-all duration-700 group-hover:brightness-110"
              priority={idx < 4}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
          </div>
        ))}
      </div>
      {/* Ambient subtle vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]" />
    </div>
  );
}
