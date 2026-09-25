'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
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
  Heart,
  Camera,
  Upload,
  Trash2,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthBar, isPasswordSecure } from '@/components/auth/password-strength-bar';

// Curated Nigerian Foodie Avatars
const PRESET_AVATARS = [
  { id: 'jollof', label: 'Party Jollof', url: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=256&q=80' },
  { id: 'suya', label: 'Flame Suya', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=256&q=80' },
  { id: 'egusi', label: 'Egusi & Pounded Yam', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=256&q=80' },
  { id: 'honey', label: 'Honey Gold', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=256&q=80' },
  { id: 'pie', label: 'Golden Meat Pie', url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=256&q=80' },
  { id: 'pepper', label: 'Fresh Scotch Bonnet', url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=256&q=80' },
];

/**
 * Client-side canvas compression to generate a clean, fast 256x256 square thumbnail
 */
function compressImageToThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Center crop square thumbnail
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

        // WebP compression at 82% quality (produces ~20-40KB)
        const dataUrl = canvas.toDataURL('image/webp', 0.82);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

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
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Saved Address Form States
  const [addressSaved, setAddressSaved] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Avatar Modal & Upload States
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security Form States (client placeholder for now)
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

  // Synchronize latest profile data from backend on mount
  useEffect(() => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch((err) => {
        console.error('Failed to sync profile from backend:', err);
      });
  }, [setUser]);

  // Sync state when user changes
  useEffect(() => {
    if (user) {
      const parts = (user.name || '').trim().split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddressLine(user.address || '');
      setCity(user.city || 'London');
      setPostcode(user.postcode || 'SE15 5BA');
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

  // Dispatch profile update to backend
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSaved(false);
    setProfileError(null);

    const token = useAuthStore.getState().token;
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: fullName || user?.name,
          phone: phone.trim() || null,
          city: city.trim() || null,
          postcode: postcode.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setProfileError(data?.error || 'Failed to update profile details.');
        return;
      }

      if (data?.user) {
        setUser(data.user);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 4000);
      }
    } catch {
      setProfileError('Unable to reach server. Please check your connection.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Dispatch address update to backend
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    setAddressSaved(false);
    setAddressError(null);

    const token = useAuthStore.getState().token;

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: addressLine.trim() || null,
          city: city.trim() || null,
          postcode: postcode.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAddressError(data?.error || 'Failed to update delivery address.');
        return;
      }

      if (data?.user) {
        setUser(data.user);
        setAddressSaved(true);
        setTimeout(() => setAddressSaved(false), 4000);
      }
    } catch {
      setAddressError('Unable to reach server. Please check your connection.');
    } finally {
      setSavingAddress(false);
    }
  };

  // Update Avatar helper (handles preset, upload, or removal)
  const handleUpdateAvatar = async (avatarUrl: string | null) => {
    setUploadingAvatar(true);
    setAvatarError(null);
    const token = useAuthStore.getState().token;

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatarUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAvatarError(data?.error || 'Failed to update avatar.');
        return;
      }

      if (data?.user) {
        setUser(data.user);
        setShowAvatarModal(false);
      }
    } catch {
      setAvatarError('Unable to reach server. Please check your connection.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle direct file upload from device
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Image size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    try {
      setUploadingAvatar(true);
      const compressedDataUrl = await compressImageToThumbnail(file);
      await handleUpdateAvatar(compressedDataUrl);
    } catch (err: any) {
      setAvatarError(err?.message || 'Failed to process image. Please try another file.');
      setUploadingAvatar(false);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 space-y-8 animate-in fade-in duration-300">
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
        <Card className="lg:col-span-1 rounded-3xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900/60 dark:backdrop-blur-xl shadow-none overflow-hidden p-6 sm:p-7 space-y-6 text-center">
          {/* Circular Avatar with Camera overlay */}
          <div className="relative inline-block mx-auto">
            <Avatar className="size-24 sm:size-28 ring-4 ring-orange-500/20">
              {user.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={user.name} />
              )}
              <AvatarFallback className="bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-extrabold text-3xl sm:text-4xl">
                {initial}
              </AvatarFallback>
            </Avatar>

            {/* Email Verified Badge on top-right */}
            {user.isEmailVerified && (
              <div
                className="absolute top-0 right-0 bg-emerald-500 text-white rounded-full p-1 shadow-sm ring-2 ring-white dark:ring-gray-900"
                title="Verified Customer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}

            {/* Camera Button on bottom-right */}
            <button
              type="button"
              onClick={() => setShowAvatarModal(true)}
              disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-orange-600 hover:bg-orange-500 text-white shadow-md ring-2 ring-white dark:ring-gray-900 transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
              title="Change Profile Avatar"
              aria-label="Change Profile Avatar"
            >
              {uploadingAvatar ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* User Name & Details */}
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
            <button
              type="button"
              onClick={() => setShowAvatarModal(true)}
              className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-semibold pt-1 cursor-pointer inline-block"
            >
              {user.avatarUrl ? 'Change Avatar' : '+ Add Avatar Photo'}
            </button>
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
          <div className="divide-y divide-gray-100 dark:divide-white/10 border-y border-gray-100 dark:border-white/10 py-1 text-xs text-left">
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
              className="w-full rounded-xl border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold h-10 cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </div>
        </Card>

        {/* Right Column: Tabbed Content Section (col-span-2) */}
        <Card className="lg:col-span-2 rounded-3xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900/60 dark:backdrop-blur-xl shadow-none overflow-hidden p-6 sm:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col gap-6">
            {/* Horizontal Tabs Header across full top width */}
            <TabsList
              variant="line"
              className="border-b border-gray-200 dark:border-white/10 w-full justify-start gap-4 sm:gap-8 pb-px overflow-x-auto"
            >
              <TabsTrigger
                value="settings"
                className="text-xs sm:text-sm font-semibold pb-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white data-active:border-b-2 data-active:border-orange-500 data-active:text-orange-600 dark:data-active:text-orange-400 transition-colors shrink-0"
              >
                Account Settings
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="text-xs sm:text-sm font-semibold pb-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white data-active:border-b-2 data-active:border-orange-500 data-active:text-orange-600 dark:data-active:text-orange-400 transition-colors shrink-0"
              >
                My Orders
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="text-xs sm:text-sm font-semibold pb-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white data-active:border-b-2 data-active:border-orange-500 data-active:text-orange-600 dark:data-active:text-orange-400 transition-colors shrink-0"
              >
                Saved Addresses
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="text-xs sm:text-sm font-semibold pb-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white data-active:border-b-2 data-active:border-orange-500 data-active:text-orange-600 dark:data-active:text-orange-400 transition-colors shrink-0"
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

              {profileError && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center gap-3 text-xs text-red-800 dark:text-red-300 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  <p className="font-semibold">{profileError}</p>
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
                      className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950/60 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:border-orange-500 dark:focus-visible:border-orange-400"
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
                      className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950/60 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:border-orange-500 dark:focus-visible:border-orange-400"
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
                      className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950/60 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:border-orange-500 dark:focus-visible:border-orange-400"
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
                      className="h-11 rounded-xl text-sm bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed"
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
                      className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950/60 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:border-orange-500 dark:focus-visible:border-orange-400"
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
                      className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950/60 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:border-orange-500 dark:focus-visible:border-orange-400"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={savingProfile}
                    className="rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs px-6 h-10 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {savingProfile ? 'Updating Profile...' : 'Update Profile'}
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* TAB 2: My Orders */}
            <TabsContent value="orders" className="space-y-6 outline-none">
              <div className="p-8 sm:p-12 text-center rounded-2xl border border-dashed border-gray-200 dark:border-white/15 bg-gray-50/50 dark:bg-gray-800/20 space-y-4">
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
              {addressSaved && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <p className="font-semibold">Delivery address saved successfully!</p>
                </div>
              )}

              {addressError && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center gap-3 text-xs text-red-800 dark:text-red-300 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  <p className="font-semibold">{addressError}</p>
                </div>
              )}

              <div className="space-y-5">
                {/* Primary Address Card */}
                <div className="p-5 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-gray-50/80 dark:bg-gray-800/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-bold text-xs text-gray-900 dark:text-white">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      Primary UK Delivery Address
                    </span>
                    <Badge variant="outline" className="text-xs text-orange-600 dark:text-orange-400 border-orange-500/30">
                      Default
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                    <p>{addressLine || 'Peckham Rye, South London'}</p>
                    <p>{city || 'London'}, {postcode || 'SE15 5BA'}</p>
                    <p className="text-gray-400">United Kingdom</p>
                  </div>
                </div>

                {/* Edit Address Form */}
                <form onSubmit={handleSaveAddress} className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <Label htmlFor="address-line" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Street Address
                    </Label>
                    <Input
                      id="address-line"
                      type="text"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      placeholder="e.g. Flat 4, 12 High Street"
                      className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950/60 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:border-orange-500 dark:focus-visible:border-orange-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="address-city" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        City
                      </Label>
                      <Input
                        id="address-city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="London"
                        className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950/60 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:border-orange-500 dark:focus-visible:border-orange-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="address-postcode" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Postcode
                      </Label>
                      <Input
                        id="address-postcode"
                        type="text"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                        placeholder="SE15 5BA"
                        className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950/60 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:border-orange-500 dark:focus-visible:border-orange-400"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={savingAddress}
                      className="rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs px-6 h-10 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {savingAddress ? 'Saving Address...' : 'Save Delivery Address'}
                    </Button>
                  </div>
                </form>
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
                    className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950/60 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:border-orange-500 dark:focus-visible:border-orange-400"
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
                    className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950/60 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:border-orange-500 dark:focus-visible:border-orange-400"
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
                    className="h-11 rounded-xl text-sm bg-white dark:bg-gray-950/60 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:border-orange-500 dark:focus-visible:border-orange-400"
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

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900 p-6 sm:p-7 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                  Choose Profile Avatar
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {avatarError && (
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <p>{avatarError}</p>
              </div>
            )}

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="hidden"
            />

            {/* Option 1: Upload from Device */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Upload from device
              </Label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/15 hover:border-orange-500 dark:hover:border-orange-500 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-center gap-3 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-4 h-4 text-orange-500" />
                <span>Choose a photo from your computer or phone (JPEG, PNG, WebP)</span>
              </button>
            </div>

            {/* Option 2: Curated Nigerian Foodie Avatars */}
            <div className="space-y-3">
              <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Or choose a Naija Foodie avatar
              </Label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {PRESET_AVATARS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleUpdateAvatar(preset.url)}
                    disabled={uploadingAvatar}
                    className="group flex flex-col items-center gap-1.5 p-2 rounded-2xl border border-gray-200/80 dark:border-white/10 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Avatar className="size-14 ring-2 ring-transparent group-hover:ring-orange-500 transition-all group-hover:scale-105">
                      <AvatarImage src={preset.url} alt={preset.label} />
                      <AvatarFallback>BT</AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 text-center truncate max-w-full">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Option 3: Remove Avatar if set */}
            {user.avatarUrl && (
              <div className="pt-2 border-t border-gray-100 dark:border-white/10 flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">Want to use letter initials instead?</span>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleUpdateAvatar(null)}
                  disabled={uploadingAvatar}
                  className="rounded-xl border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold h-8 flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Avatar</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
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
