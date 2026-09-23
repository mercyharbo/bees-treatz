import React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-amber-500/20 selection:text-amber-900 dark:selection:text-amber-200">
      {/* Floating Pill Navbar matching Attachment 3 */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Dark Ambient Footer matching Attachment 4 */}
      <Footer />
    </div>
  );
}
