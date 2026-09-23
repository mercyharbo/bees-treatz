import React from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-card p-6 space-y-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍯</span>
          <span className="font-bold text-primary">Bee&apos;s Kitchen</span>
        </div>
        <nav className="space-y-2">
          <Link
            href="/admin"
            className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            📋 Live Orders Feed
          </Link>
          <Link
            href="/admin/menu"
            className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            🍲 Menu &amp; Stock Toggles
          </Link>
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            ⬅ View Customer Site
          </Link>
        </nav>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
