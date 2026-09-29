'use client';

import React from 'react';
import { MenuHero } from '@/components/menu/menu-hero';
import { MenuCatalog } from '@/components/menu/menu-catalog';

export default function MenuPage() {
  return (
    <div className="w-full space-y-0 animate-in fade-in duration-300">
      <MenuHero />
      <MenuCatalog />
    </div>
  );
}
