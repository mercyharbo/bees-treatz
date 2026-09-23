import type { Metadata } from 'next';
import './globals.css';
import { SWRProvider } from '@/components/providers/swr-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
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
    <html lang="en" suppressHydrationWarning className={cn('font-sans', inter.variable, lato.variable)}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <SWRProvider>{children}</SWRProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
