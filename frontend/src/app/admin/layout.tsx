import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50/70 dark:bg-gray-950">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900/60 dark:backdrop-blur-xl p-6 space-y-8 flex flex-col justify-between">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍯</span>
            <span className="font-extrabold text-orange-600 dark:text-orange-500">Bee&apos;s Kitchen</span>
          </div>
          <nav className="space-y-1.5">
            <Link
              href="/admin"
              className="block rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              📋 Live Orders Feed
            </Link>
            <Link
              href="/admin/menu"
              className="block rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              🍲 Menu &amp; Stock Toggles
            </Link>
            <Link
              href="/"
              className="block rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              ⬅ View Customer Site
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer with ThemeToggle */}
        <div className="pt-4 border-t border-gray-200/80 dark:border-white/10 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">Appearance</span>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
