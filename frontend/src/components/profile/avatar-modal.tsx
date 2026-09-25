'use client';

import React, { useRef, useState } from 'react';
import { Sparkles, X, AlertCircle, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

// Curated Nigerian Foodie Avatars
export const PRESET_AVATARS = [
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
export function compressImageToThumbnail(file: File): Promise<string> {
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

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl?: string | null;
  onUpdateAvatar: (url: string | null) => Promise<void>;
  uploading: boolean;
}

export function AvatarModal({
  isOpen,
  onClose,
  currentAvatarUrl,
  onUpdateAvatar,
  uploading,
}: AvatarModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  if (!isOpen) return null;

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
      setAvatarError(null);
      const compressedDataUrl = await compressImageToThumbnail(file);
      await onUpdateAvatar(compressedDataUrl);
      onClose();
    } catch (err: any) {
      setAvatarError(err?.message || 'Failed to process image. Please try another file.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSelectPreset = async (url: string) => {
    try {
      setAvatarError(null);
      await onUpdateAvatar(url);
      onClose();
    } catch (err: any) {
      setAvatarError(err?.message || 'Failed to select avatar.');
    }
  };

  const handleRemove = async () => {
    try {
      setAvatarError(null);
      await onUpdateAvatar(null);
      onClose();
    } catch (err: any) {
      setAvatarError(err?.message || 'Failed to remove avatar.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-md border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900 p-6 sm:p-7 shadow-none space-y-6">
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
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {avatarError && (
          <div className="p-3.5 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300">
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
            disabled={uploading}
            className="w-full p-4 rounded-md border-2 border-dashed border-gray-200 dark:border-white/15 hover:border-orange-500 dark:hover:border-orange-500 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-center gap-3 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors cursor-pointer disabled:opacity-50"
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
                onClick={() => handleSelectPreset(preset.url)}
                disabled={uploading}
                className="group flex flex-col items-center gap-1.5 p-2 rounded-md border border-gray-200/80 dark:border-white/10 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all cursor-pointer disabled:opacity-50"
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
        {currentAvatarUrl && (
          <div className="pt-2 border-t border-gray-100 dark:border-white/10 flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Want to use letter initials instead?</span>
            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
              disabled={uploading}
              className="rounded-md border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold h-8 flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Avatar</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
