'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile } from '@/types/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useUkLocations } from '@/hooks/useUkLocations';

interface AccountSettingsTabProps {
  user: UserProfile;
}

export function AccountSettingsTab({ user }: AccountSettingsTabProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const { regions, isLoading: loadingLocations } = useUkLocations();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state when user prop changes
  useEffect(() => {
    if (user) {
      const parts = (user.name || '').trim().split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setState(user.state || 'Greater London');
      setCity(user.city || 'London');
      setPostcode(user.postcode || 'SE15 5BA');
    }
  }, [user]);

  // Determine available cities for currently selected state/region
  const selectedRegion = regions.find((r) => r.name.toLowerCase() === state.toLowerCase());
  const availableCities = selectedRegion ? selectedRegion.cities : [];

  const handleStateChange = (newState: string) => {
    setState(newState);
    const region = regions.find((r) => r.name.toLowerCase() === newState.toLowerCase());
    if (region && region.cities.length > 0) {
      if (!region.cities.includes(city)) {
        setCity(region.cities[0]);
      }
    } else {
      setCity('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

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
          name: fullName || user.name,
          phone: phone.trim() || null,
          address: address.trim() || null,
          state: state.trim() || null,
          city: city.trim() || null,
          postcode: postcode.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Failed to update profile details.');
        return;
      }

      if (data?.user) {
        setUser(data.user);
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      }
    } catch {
      setError('Unable to reach server. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 outline-none">
      {saved && (
        <div className="p-4 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="font-semibold">Profile details saved successfully!</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center gap-3 text-xs text-red-800 dark:text-red-300 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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
            />
          </div>

          {/* Email address (read-only) */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-email" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <Input
              id="profile-email"
              type="email"
              value={email}
              disabled
              className="bg-gray-50 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Street Address */}
        <div className="space-y-1.5">
          <Label htmlFor="profile-address" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Street Address
          </Label>
          <Input
            id="profile-address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Flat 4, 12 High Street"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* State / Region (Select) */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-state" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              State / Region
            </Label>
            <Select
              id="profile-state"
              size="md"
              value={state}
              onChange={(e) => handleStateChange(e.target.value)}
              disabled={loadingLocations}
            >
              <option value="">{loadingLocations ? 'Loading states...' : 'Select State / Region'}</option>
              {regions.map((region) => (
                <option key={region.code} value={region.name}>
                  {region.name}
                </option>
              ))}
            </Select>
          </div>

          {/* City / Town (Select) */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-city" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              City / Town
            </Label>
            <Select
              id="profile-city"
              size="md"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={availableCities.length === 0}
            >
              <option value="">{availableCities.length === 0 ? 'Select state first' : 'Select City'}</option>
              {city && !availableCities.includes(city) && (
                <option value={city}>{city}</option>
              )}
              {availableCities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </Select>
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
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={saving}
            className="rounded-md bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs px-6 h-10 shadow-none cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Updating Profile...' : 'Update Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}
