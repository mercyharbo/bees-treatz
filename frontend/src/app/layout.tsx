import type { Metadata } from 'next';
import './globals.css';
import { SWRProvider } from '@/components/providers/swr-provider';
import { Inter, Lato } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Bee's Treatz | Authentic Nigerian Kitchen & Street Food UK",
  description: "Delicious, freshly cooked Nigerian dishes, party jollof, soups, and suya delivered across the UK.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn('font-sans', inter.variable, lato.variable)}>
      <body className="min-h-screen bg-background antialiased font-sans">
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  );
}
