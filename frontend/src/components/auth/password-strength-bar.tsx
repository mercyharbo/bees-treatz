'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PasswordStrengthLevel } from '@/types';

export interface PasswordRequirement {
  id: string;
  label: string;
  met: boolean;
}

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { id: 'lowercase', label: 'One lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { id: 'number', label: 'One number (0-9)', met: /[0-9]/.test(password) },
    {
      id: 'special',
      label: 'One special symbol (!@#$...)',
      met: /[!@#$%^&*(),.?":{}|<>_\-\[\]]/.test(password),
    },
  ];
}

export function isPasswordSecure(password: string): boolean {
  if (!password) return false;
  return getPasswordRequirements(password).every((req) => req.met);
}

export function calculatePasswordStrength(password: string): PasswordStrengthLevel {
  if (!password) return 0;
  const requirements = getPasswordRequirements(password);
  const metCount = requirements.filter((r) => r.met).length;

  if (metCount <= 2) return 1;
  if (metCount === 3) return 2;
  if (metCount === 4) return 3;
  return 4;
}

interface PasswordStrengthBarProps {
  level?: PasswordStrengthLevel;
  password?: string;
  showRequirements?: boolean;
}

export function PasswordStrengthBar({
  level,
  password = '',
  showRequirements = true,
}: PasswordStrengthBarProps) {
  const computedLevel =
    password.length > 0 ? calculatePasswordStrength(password) : (level ?? 0);
  const requirements = getPasswordRequirements(password);

  const getBarColor = (index: number) => {
    if (index >= computedLevel || computedLevel === 0) {
      return 'bg-gray-200 dark:bg-gray-800';
    }
    if (computedLevel === 1) return 'bg-red-500';
    if (computedLevel === 2) return 'bg-amber-500';
    if (computedLevel === 3) return 'bg-emerald-500';
    return 'bg-emerald-600 dark:bg-emerald-500';
  };

  const getStrengthLabel = () => {
    if (computedLevel === 1) return 'Weak';
    if (computedLevel === 2) return 'Fair';
    if (computedLevel === 3) return 'Good';
    if (computedLevel >= 4) return 'Strong';
    return '';
  };

  const getStrengthTextColor = () => {
    if (computedLevel === 1) return 'text-red-500';
    if (computedLevel === 2) return 'text-amber-500';
    if (computedLevel === 3) return 'text-emerald-500';
    if (computedLevel >= 4) return 'text-emerald-600 dark:text-emerald-400';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-2 pt-1.5" aria-label="Password strength meter">
      {/* Strength Bar & Label */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">Password strength</span>
          {password.length > 0 && (
            <span className={cn('font-semibold', getStrengthTextColor())}>
              {getStrengthLabel()}
            </span>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                getBarColor(idx)
              )}
            />
          ))}
        </div>
      </div>

      {/* Password Requirements Checklist */}
      {showRequirements && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 pt-1">
          {requirements.map((req) => (
            <div
              key={req.id}
              className={cn(
                'flex items-center gap-1.5 text-xs transition-colors duration-200',
                req.met
                  ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                  : 'text-gray-400 dark:text-gray-500'
              )}
            >
              {req.met ? (
                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-700 ml-1 mr-1 shrink-0" />
              )}
              <span>{req.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
