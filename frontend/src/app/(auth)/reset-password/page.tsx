'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthLogo } from '@/components/auth/auth-logo';
import { PasswordStrengthBar, isPasswordSecure } from '@/components/auth/password-strength-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = isPasswordSecure(password) && confirmPassword.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Missing reset token. Please request a new password reset link.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to reset password.');
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Unable to reach server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Brand Header */}
      <div className="flex justify-center">
        <AuthLogo />
      </div>

      {/* Heading */}
      <div className="text-center space-y-1.5 pt-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Reset Password
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Create a new strong password for your account.
        </p>
      </div>

      {!token && !submitted && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
            <p className="font-semibold">Reset token missing</p>
            <p>Please use the reset link sent to your email or request a new one.</p>
          </div>
        </div>
      )}

      {submitted ? (
        <div className="space-y-6 pt-2">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
              <p className="font-semibold">Password updated successfully!</p>
              <p>Your password has been changed. You can now sign in with your new credentials.</p>
            </div>
          </div>

          <Button
            asChild
            className="w-full text-white cursor-pointer"
          >
            <Link href="/login">
              <span>Sign In Now</span>
            </Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="reset-new-password" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              New Password
            </Label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none z-10" />
              <Input
                id="reset-new-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Type new password (min 8 chars)"
                className="h-11 pl-10 pr-11 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus-visible:border-orange-500 dark:focus-visible:border-orange-500 focus-visible:ring-orange-500/20 transition-colors outline-none text-gray-900 dark:text-white placeholder:text-gray-400 shadow-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 z-10"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <PasswordStrengthBar password={password} />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="reset-confirm-password" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Confirm Password
            </Label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none z-10" />
              <Input
                id="reset-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Re-type your password"
                className={cn(
                  'h-11 pl-10 pr-4 rounded-xl text-sm bg-white dark:bg-gray-900 border transition-colors outline-none text-gray-900 dark:text-white placeholder:text-gray-400 shadow-none',
                  error
                    ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500'
                    : 'border-gray-200 dark:border-gray-800 focus-visible:border-orange-500 dark:focus-visible:border-orange-500 focus-visible:ring-orange-500/20'
                )}
                required
              />
            </div>
            {error && (
              <p className="text-xs font-medium text-red-500 pt-1 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </p>
            )}
          </div>

          {/* Action Button (shadcn Button) */}
          <Button
            type="submit"
            disabled={!isFormValid || loading || !token}
            className={cn(
              'w-full',
              isFormValid && !loading && token
                ? 'text-white cursor-pointer'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-800',
            )}
          >
            {loading ? 'Saving Password...' : 'Save New Password'}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      )}

      {/* Footer Links */}
      <div className="pt-8 flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
        <Link href="#" className="hover:underline">
          Privacy Policy
        </Link>
        <span>•</span>
        <Link href="#" className="hover:underline">
          Terms of Service
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-sm text-gray-500">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
