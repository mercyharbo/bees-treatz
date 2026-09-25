'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  AlertCircle,
  Mail,
  KeyRound,
  Send,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile } from '@/types/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthBar, isPasswordSecure } from '@/components/auth/password-strength-bar';

interface SecurityTabProps {
  user: UserProfile;
}

export function SecurityTab({ user }: SecurityTabProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeCode, setPasswordChangeCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [codeNotice, setCodeNotice] = useState<string | null>(null);

  // 60-second cooldown timer for resending OTP code
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Request 6-digit verification code to be sent to user's email via Resend
  const handleRequestPasswordCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPasswordError(null);
    setCodeNotice(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (!isPasswordSecure(newPassword)) {
      setPasswordError('Please ensure your new password satisfies all security requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError('New password must be different from your current password.');
      return;
    }

    setSendingCode(true);
    const token = useAuthStore.getState().token;

    try {
      const res = await fetch('/api/auth/change-password/request-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data?.error || 'Failed to send verification code.');
        return;
      }

      setCodeSent(true);
      setResendCooldown(60);
      setCodeNotice(data?.message || 'A 6-digit verification code has been sent to your email.');
    } catch {
      setPasswordError('Unable to reach server. Please check your connection.');
    } finally {
      setSendingCode(false);
    }
  };

  // Confirm password change with 6-digit OTP code
  const handleConfirmChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!passwordChangeCode || passwordChangeCode.trim().length !== 6) {
      setPasswordError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setSavingPassword(true);
    const token = useAuthStore.getState().token;

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
          code: passwordChangeCode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data?.error || 'Failed to change password. Please check your verification code.');
        return;
      }

      setPasswordSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordChangeCode('');
      setCodeSent(false);
      setCodeNotice(null);
      setTimeout(() => setPasswordSaved(false), 5000);
    } catch {
      setPasswordError('Unable to reach server. Please check your connection.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 outline-none">
      {passwordSaved && (
        <div className="p-4 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="font-semibold">Password updated successfully! A security confirmation was sent to your email.</p>
        </div>
      )}

      {passwordError && (
        <div className="p-4 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center gap-3 text-xs text-red-800 dark:text-red-300 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          <p className="font-semibold">{passwordError}</p>
        </div>
      )}

      {codeNotice && (
        <div className="p-4 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-300 animate-in fade-in">
          <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="font-semibold">{codeNotice}</p>
        </div>
      )}

      <form onSubmit={codeSent ? handleConfirmChangePassword : handleRequestPasswordCode} className="space-y-5 max-w-lg">
        <div className="space-y-1.5">
          <Label htmlFor="current-pass" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Current Password
          </Label>
          <Input
            id="current-pass"
            type="password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              if (passwordError) setPasswordError(null);
            }}
            disabled={codeSent}
            placeholder="Enter current password"
            className="disabled:opacity-60"
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
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (passwordError) setPasswordError(null);
            }}
            disabled={codeSent}
            placeholder="Enter new password (min 8 chars)"
            className="disabled:opacity-60"
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
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (passwordError) setPasswordError(null);
            }}
            disabled={codeSent}
            placeholder="Re-type new password"
            className="disabled:opacity-60"
            required
          />
        </div>

        {/* Step 2: 2FA Verification Code Box */}
        {codeSent && (
          <div className="p-4 sm:p-5 rounded-md bg-orange-50/70 dark:bg-orange-950/20 border-2 border-dashed border-orange-300 dark:border-orange-800 space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <Label htmlFor="otp-code" className="text-xs font-bold text-orange-950 dark:text-orange-300 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                  6-Digit Email Verification Code
                </Label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  We sent a code to <span className="font-semibold text-gray-900 dark:text-white">{user.email}</span>. Code is valid for 15 minutes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCodeSent(false);
                  setPasswordChangeCode('');
                }}
                className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-white underline cursor-pointer"
              >
                Edit Passwords
              </button>
            </div>

            <div className="space-y-2">
              <Input
                id="otp-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                value={passwordChangeCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setPasswordChangeCode(val);
                  if (passwordError) setPasswordError(null);
                }}
                placeholder="••••••"
                className="h-12 text-center text-xl font-mono font-extrabold tracking-[0.5em] bg-white dark:bg-gray-900 border-orange-300 dark:border-orange-700"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-gray-500 dark:text-gray-400">Didn&apos;t receive code?</span>
              <button
                type="button"
                onClick={handleRequestPasswordCode}
                disabled={resendCooldown > 0 || sendingCode}
                className="font-semibold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${sendingCode ? 'animate-spin' : ''}`} />
                <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}</span>
              </button>
            </div>
          </div>
        )}

        <div className="pt-2">
          {!codeSent ? (
            <Button
              type="submit"
              disabled={sendingCode || !currentPassword || !newPassword || !confirmPassword}
              className="rounded-md bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs px-6 h-10 shadow-none cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {sendingCode ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Verification Code</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={savingPassword || passwordChangeCode.trim().length !== 6}
              className="rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-6 h-10 shadow-none cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {savingPassword ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying & Updating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Confirm & Update Password</span>
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
