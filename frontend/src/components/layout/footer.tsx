import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative w-full bg-[#080a0c] text-gray-300 pt-16 sm:pt-20 pb-0 overflow-hidden border-t border-white/10 select-none">
      {/* Soft Ambient Radial Glow (Attachment 4) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Full width container with generous responsive padding */}
      <div className="relative w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
        {/* Top Grid: Brand & Link Columns spanning full width */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 2xl:gap-16 pb-12 sm:pb-16">
          {/* Brand Info (Attachment 4 Left Column) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                🍯
              </div>
              <span className="font-extrabold text-xl text-white">
                Bee&apos;s Treatz
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-md">
              Authentic Nigerian kitchen delivering firewood-style Party Jollof, hearty Egusi, and spicy Suya skewers straight to your doorstep across the UK.
            </p>
          </div>

          {/* Column 1: Explore */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/#menu" className="hover:text-white transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/#specials" className="hover:text-white transition-colors">
                  Daily Specials
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition-colors">
                  Order Online
                </Link>
              </li>
              <li>
                <Link href="/#delivery" className="hover:text-white transition-colors">
                  Delivery Coverage
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/#kitchen" className="hover:text-white transition-colors">
                  Fresh Kitchen
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Reviews &amp; Press
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Get In Touch */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400">
              Get In Touch
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="mailto:orders@beestreatz.co.uk" className="hover:text-white transition-colors">
                  orders@beestreatz.co.uk
                </Link>
              </li>
              <li>
                <Link href="https://wa.me/447000000000" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp Support
                </Link>
              </li>
              <li className="text-gray-500">
                London, United Kingdom
              </li>
            </ul>
          </div>
        </div>

        {/* Divider with Copyright and Social Icons (Attachment 4) */}
        <div className="border-t border-white/10 pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Bee&apos;s Treatz. All rights reserved.
          </p>

          {/* Social Icons matching Attachment 4 - using Next.js Link instead of raw <a> */}
          <div className="flex items-center gap-4 text-gray-400">
            {/* Twitter/X */}
            <Link href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="X (Twitter)">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            {/* Instagram */}
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>
            {/* LinkedIn */}
            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Giant Typography Watermark Banner (Attachment 4 Bottom Design) */}
      <div className="relative w-full overflow-hidden flex justify-center -mb-8 sm:-mb-14 lg:-mb-20 pointer-events-none select-none">
        <h2 className="text-[18vw] font-black uppercase text-white/[0.08] leading-none whitespace-nowrap">
          Bee&apos;s Treatz
        </h2>
      </div>
    </footer>
  );
}
