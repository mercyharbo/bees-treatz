'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  AlertCircle,
  ShoppingBag,
  LogOut,
  MapPin,
  Lock,
  CheckCircle2,
  ExternalLink,
  Heart,
  Clock,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthBar, isPasswordSecure } from '@/components/auth/password-strength-bar';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'settings';

  const { user, isAuthenticated, isLoading, initialize, logout, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Profile Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('London');
  const [postcode, setPostcode] = useState('SE15 5BA');
  const [addressLine, setAddressLine] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/profile');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      const parts = (user.name || '').trim().split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSaved(false);

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (user) {
      setUser({
        ...user,
        name: fullName || user.name,
        phone: phone.trim() || undefined,
      });
    }

    setTimeout(() => {
      setSavingProfile(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 4000);
    }, 400);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!isPasswordSecure(newPassword)) {
      setPasswordError('Please ensure your new password satisfies all security requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setPasswordSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSaved(false), 4000);
  };

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-500 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Page Title & Breadcrumb */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Manage your personal details, food orders, delivery addresses, and security settings.
        </p>
      </div>

      {/* Main Grid: 1-Column Left Summary + 2-Column Right Tabbed Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left Column: Profile Summary Card (col-span-1) */}
        <Card className="lg:col-span-1 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden p-6 sm:p-7 space-y-6 text-center">
          {/* Circular Avatar */}
          <div className="relative inline-block mx-auto">
            <Avatar className="size-24 sm:size-28 ring-4 ring-orange-500/20 shadow-md">
              <AvatarFallback className="bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-extrabold text-3xl sm:text-4xl">
                {initial}
              </AvatarFallback>
            </Avatar>
            {user.isEmailVerified && (
              <div
                className="absolute bottom-1 right-1 bg-emerald-500 text-white rounded-full p-1 shadow-sm ring-2 ring-white dark:ring-gray-900"
                title="Verified Customer"
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* User Name & Details */}
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold pt-0.5">
              Bee&apos;s Treatz Customer
            </p>
          </div>

          {/* Verification Badge */}
          <div className="flex justify-center">
            {user.isEmailVerified ? (
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 gap-1.5 px-3 py-1 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Account
              </Badge>
            ) : (
              <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 gap-1.5 px-3 py-1 text-xs font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                Unverified Email
              </Badge>
            )}
          </div>

          {/* Unverified Action Banner */}
          {!user.isEmailVerified && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 space-y-2 text-left">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                Verify your email address
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                Confirm your email to unlock all loyalty perks and order tracking updates.
              </p>
              <Button
                asChild
                size="sm"
                className="w-full rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs h-8 cursor-pointer shadow-sm"
              >
                <Link href={`/verify-email?email=${encodeURIComponent(user.email)}`}>
                  Verify Now
                </Link>
              </Button>
            </div>
          )}

          {/* Summary Stats Rows */}
          <div className="divide-y divide-gray-100 dark:divide-gray-800 border-y border-gray-100 dark:border-gray-800 py-1 text-xs text-left">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Total Orders</span>
              <span className="font-bold text-gray-900 dark:text-white">0</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Saved Favorites</span>
              <span className="font-bold text-gray-900 dark:text-white">0</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Treatz Points</span>
              <span className="font-bold text-orange-600 dark:text-orange-400">50 pts</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2.5 pt-1">
            <Button
              asChild
              className="w-full rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs h-10 shadow-sm cursor-pointer"
            >
              <Link href="/#menu">Browse Menu</Link>
            </Button>
            <Button
              type="button"
              onClick={handleSignOut}
              variant="outline"
              className="w-full rounded-xl border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold h-10 cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </div>
        </Card>

        {/* Right Column: Tabbed Content Section (col-span-2) */}
        <Card className="lg:col-span-2 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden p-6 sm:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Horizontal Tabs Header inspired by reference design */}
            <TabsList
              variant="line"
              className="border-b border-gray-100 dark:border-gray-800 w-full justify-start gap-4 sm:gap-8 pb-px overflow-x-auto"
            >
              <TabsTrigger
                value="settings"
                className="text-xs sm:text-sm font-semibold pb-3 data-active:border-b-2 data-active:border-orange-500 data-active:text-orange-600 dark:data-active:text-orange-400 text-gray-500 dark:text-gray-400"
              >
                Account Settings
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="text-xs sm:text-sm font-semibold pb-3 data-active:border-b-2 data-active:border-orange-500 data-active:text-orange-600 dark:data-active:text-orange-400 text-gray-500 dark:text-gray-400"
              >
                My Orders
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="text-xs sm:text-sm font-semibold pb-3 data-active:border-b-2 data-active:border-orange-500 data-active:text-orange-600 dark:data-active:text-orange-400 text-gray-500 dark:text-gray-400"
              >
                Saved Addresses
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="text-xs sm:text-sm font-semibold pb-3 data-active:border-b-2 data-active:border-orange-500 data-active:text-orange-600 dark:data-active:text-orange-400 text-gray-500 dark:text-gray-400"
              >
                Security
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Account Settings (Default) */}
            <TabsContent value="settings" className="space-y-6 outline-none">
              {profileSaved && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <p className="font-semibold">Profile details saved successfully!</p>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-first-name" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      First Name
                    </Label>
                    <Input
                      id="profile-first-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-last-name" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Last Name
                    </Label>
                    <Input
                      id="profile-last-name"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-phone" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Phone Number
                    </Label>
                    <Input
                      id="profile-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 7123 456789"
                      className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Email address */}
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-email" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Email Address
                    </Label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={email}
                      disabled
                      className="h-11 rounded-xl text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* City */}
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-city" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      City
                    </Label>
                    <Input
                      id="profile-city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="London"
                      className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Postcode */}
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-postcode" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Postcode
                    </Label>
                    <Input
                      id="profile-postcode"
                      type="text"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                      placeholder="SE15 5BA"
                      className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={savingProfile}
                    className="rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs px-6 h-10 shadow-sm cursor-pointer"
                  >
                    {savingProfile ? 'Updating Profile...' : 'Update Profile'}
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* TAB 2: My Orders */}
            <TabsContent value="orders" className="space-y-6 outline-none">
              <div className="p-8 sm:p-12 text-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    No Orders Placed Yet
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    Hungry for authentic Nigerian jollof, savory meat pies, or spicy peppered beef? Order now and enjoy fresh delivery across London.
                  </p>
                </div>
                <Button
                  asChild
                  className="rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs px-5 h-9 shadow-sm cursor-pointer"
                >
                  <Link href="/#menu">Browse Delicious Menu</Link>
                </Button>
              </div>
            </TabsContent>

            {/* TAB 3: Saved Addresses */}
            <TabsContent value="addresses" className="space-y-6 outline-none">
              <div className="space-y-4">
                <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-bold text-xs text-gray-900 dark:text-white">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      Primary Delivery Address
                    </span>
                    <Badge variant="outline" className="text-xs text-orange-600 dark:text-orange-400 border-orange-500/30">
                      Default
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                    <p>{addressLine || 'Peckham Rye, South London'}</p>
                    <p>{city}, {postcode}</p>
                    <p className="text-gray-400">United Kingdom</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label htmlFor="address-line" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Update Street Address
                  </Label>
                  <Input
                    id="address-line"
                    type="text"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="e.g. Flat 4, 12 High Street"
                    className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: Security */}
            <TabsContent value="security" className="space-y-6 outline-none">
              {passwordSaved && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <p className="font-semibold">Password updated successfully!</p>
                </div>
              )}

              {passwordError && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center gap-3 text-xs text-red-800 dark:text-red-300 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  <p className="font-semibold">{passwordError}</p>
                </div>
              )}

              <form onSubmit={handleSavePassword} className="space-y-5 max-w-lg">
                <div className="space-y-1.5">
                  <Label htmlFor="current-pass" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Current Password
                  </Label>
                  <Input
                    id="current-pass"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="new-pass" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    New Password
                  </Label>
                  <Input
                    id="new-pass"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 8 chars)"
                    className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                  <PasswordStrengthBar password={newPassword} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirm-new-pass" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-new-pass"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs px-6 h-10 shadow-sm cursor-pointer"
                  >
                    Change Password
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-gray-500">Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
