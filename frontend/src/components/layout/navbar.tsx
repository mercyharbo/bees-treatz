'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  User as UserIcon,
  ChevronDown,
  Heart,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useHydratedCartStore } from '@/store/useCartStore';
import { useHydratedAuthStore, useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const itemCount = useHydratedCartStore((state) => state.getItemCount(), 0);
  const user = useHydratedAuthStore((state) => state.user, null);
  const isAuthenticated = useHydratedAuthStore((state) => state.isAuthenticated, false);
  const { initialize, logout } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

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

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

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

        {/* Right Actions: Cart & Avatar Dropdown */}
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

          {/* Desktop User Profile Avatar with Dropdown */}
          <div className="hidden sm:inline-block">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      className="flex items-center gap-1.5 p-0.5 rounded-full hover:bg-white/10 transition-colors outline-none cursor-pointer group"
                      aria-label="Open user menu"
                    />
                  }
                >
                  <Avatar className="size-8.5 ring-2 ring-amber-500/50 transition-transform group-hover:scale-105">
                    <AvatarFallback className="bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-xs">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors mr-0.5" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-56 p-1.5 rounded-2xl bg-gray-900/95 dark:bg-black/95 backdrop-blur-xl border border-white/15 text-white shadow-2xl space-y-0.5"
                >
                  <DropdownMenuLabel className="px-3 py-2">
                    <p className="font-bold text-sm text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 font-normal truncate">{user.email}</p>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-white/10 my-1" />

                  <DropdownMenuItem
                    render={
                      <Link
                        href="/profile"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-white/10 text-gray-200 hover:text-white transition-colors cursor-pointer w-full"
                      />
                    }
                  >
                    <UserIcon className="w-4 h-4 text-orange-400" />
                    <span>Profile</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    render={
                      <Link
                        href="/profile?tab=orders"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-white/10 text-gray-200 hover:text-white transition-colors cursor-pointer w-full"
                      />
                    }
                  >
                    <ShoppingBag className="w-4 h-4 text-orange-400" />
                    <span>My Orders</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    render={
                      <Link
                        href="/profile?tab=wishlist"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-white/10 text-gray-200 hover:text-white transition-colors cursor-pointer w-full"
                      />
                    }
                  >
                    <Heart className="w-4 h-4 text-orange-400" />
                    <span>Wishlist</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-white/10 my-1" />

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                variant="default"
                className="rounded-full bg-white text-gray-950 hover:bg-gray-100 font-semibold text-xs sm:text-sm px-5 h-9 shadow-md border-none cursor-pointer"
              >
                <Link href="/login">
                  <span>Sign In</span>
                </Link>
              </Button>
            )}
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
          <div className="pt-2 border-t border-white/10 space-y-2">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl">
                  <Avatar className="size-9 ring-1 ring-amber-500/40">
                    <AvatarFallback className="bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-xs">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <Button
                  asChild
                  className="w-full rounded-full bg-white text-gray-950 hover:bg-gray-100 font-semibold text-xs h-9 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <UserIcon className="w-3.5 h-3.5 text-orange-500" />
                    <span>My Profile</span>
                  </Link>
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full bg-white/5 hover:bg-white/10 text-white border-white/15 text-xs h-8 cursor-pointer"
                  >
                    <Link href="/profile?tab=orders" onClick={() => setMobileMenuOpen(false)}>
                      <ShoppingBag className="w-3.5 h-3.5 mr-1 text-orange-400" />
                      <span>Orders</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full bg-white/5 hover:bg-white/10 text-white border-white/15 text-xs h-8 cursor-pointer"
                  >
                    <Link href="/profile?tab=wishlist" onClick={() => setMobileMenuOpen(false)}>
                      <Heart className="w-3.5 h-3.5 mr-1 text-orange-400" />
                      <span>Wishlist</span>
                    </Link>
                  </Button>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  variant="outline"
                  className="w-full rounded-full bg-transparent hover:bg-red-500/10 text-red-400 hover:text-red-300 border-white/10 text-xs font-medium h-9 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <Button
                asChild
                className="w-full rounded-full bg-white text-gray-950 hover:bg-gray-100 font-semibold text-sm h-10 cursor-pointer"
              >
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <span>Sign In</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
