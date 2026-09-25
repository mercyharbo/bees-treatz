'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile } from '@/types/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useUkLocations } from '@/hooks/queries';
import { api } from '@/lib/api';

interface SavedAddressesTabProps {
  user: UserProfile;
}

export function SavedAddressesTab({ user }: SavedAddressesTabProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const { regions, loading: loadingLocations } = useUkLocations();

  const [addressLine, setAddressLine] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setAddressLine(user.address || '');
      setState(user.state || 'Greater London');
      setCity(user.city || 'London');
      setPostcode(user.postcode || 'SE15 5BA');
    }
  }, [user]);

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

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const data = await api.patch<{ user?: UserProfile }>('/auth/profile', {
        address: addressLine.trim() || null,
        state: state.trim() || null,
        city: city.trim() || null,
        postcode: postcode.trim() || null,
      });

      if (data?.user) {
        setUser(data.user);
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update delivery address.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 outline-none">
      {saved && (
        <div className="p-4 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="font-semibold">Delivery address saved successfully!</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center gap-3 text-xs text-red-800 dark:text-red-300 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <div className="space-y-5">
        {/* Primary Address Card */}
        <div className="p-5 rounded-md border border-gray-200/80 dark:border-white/10 bg-gray-50/80 dark:bg-gray-800/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 font-bold text-xs text-gray-900 dark:text-white">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              Primary UK Delivery Address
            </span>
            <Badge variant="outline" className="text-xs text-orange-600 dark:text-orange-400 border-orange-500/30 rounded-md">
              Default
            </Badge>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
            <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
            <p>{addressLine || 'No street address saved'}</p>
            <p>
              {[city || 'London', state, postcode || 'SE15 5BA'].filter(Boolean).join(', ')}
            </p>
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
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* State / Region */}
            <div className="space-y-1.5">
              <Label htmlFor="address-state" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                State / Region
              </Label>
              <Select
                id="address-state"
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

            {/* City */}
            <div className="space-y-1.5">
              <Label htmlFor="address-city" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                City / Town
              </Label>
              <Select
                id="address-city"
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
              <Label htmlFor="address-postcode" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Postcode
              </Label>
              <Input
                id="address-postcode"
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
              {saving ? 'Saving Address...' : 'Save Delivery Address'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
