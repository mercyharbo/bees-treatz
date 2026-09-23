import React from 'react';
import Link from 'next/link';

export function AuthLogo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group transition-transform active:scale-95">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-md shadow-orange-500/20 text-white font-bold text-lg">
        🍯
      </div>
      <span className="font-extrabold text-xl text-gray-900 dark:text-gray-100">
        Bee&apos;s Treatz
      </span>
    </Link>
  );
}
