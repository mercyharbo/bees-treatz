'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu as MenuIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHydratedCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const itemCount = useHydratedCartStore((state) => state.getItemCount(), 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/#menu' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-300">
      <div
        className={cn(
          'flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-300',
          scrolled
            ? 'bg-gray-900/80 dark:bg-black/80 backdrop-blur-xl border border-white/15 text-white shadow-xl shadow-black/20'
            : 'bg-gray-900/60 backdrop-blur-md border border-white/10 text-white shadow-lg'
        )}
      >
        {/* Brand Logo (Attachment 3) */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm text-sm font-bold">
            🍯
          </div>
          <span className="font-extrabold text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors">
            Bee&apos;s Treatz
          </span>
        </Link>

        {/* Center Navigation Links Container */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200',
                  isActive
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Cart & CTA Button (Attachment 3) */}
        <div className="flex items-center gap-3">
          {/* Cart Icon with badge */}
          <Link
            href="/checkout"
            className="relative p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-gray-950 font-bold text-xs w-4 h-4 rounded-full flex items-center justify-center shadow">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Rounded Pill CTA Button (Attachment 3: "Get Started" style) */}
          <div className="hidden sm:inline-block">
            <Button
              asChild
              variant="default"
              className="rounded-full bg-white text-gray-950 hover:bg-gray-100 font-semibold text-xs sm:text-sm px-5 h-9 shadow-md border-none"
            >
              <Link href="/login">
                <span>Sign In</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-white/15 text-white shadow-2xl animate-in slide-in-from-top-2 duration-200 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-sm font-medium rounded-xl hover:bg-white/10 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10">
            <Button
              asChild
              className="w-full rounded-full bg-white text-gray-950 hover:bg-gray-100 font-semibold text-sm h-10"
            >
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <span>Sign In</span>
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
