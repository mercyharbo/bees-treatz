'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthLogo } from '@/components/auth/auth-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = email.includes('@');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send reset link.');
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
          Forgot Password?
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your email and we&apos;ll send you instructions to reset your password.
        </p>
      </div>

      {submitted ? (
        <div className="space-y-6 pt-2">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
              <p className="font-semibold">Reset link sent!</p>
              <p>If an account exists for <span className="font-medium underline">{email}</span>, password reset instructions have been sent.</p>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            className="w-full"
          >
            <Link href="/login">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Email Field */}
          <div className="space-y-1.5">
            <Label htmlFor="forgot-email" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Email
            </Label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none z-10" />
              <Input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Type your email address"
                className="h-11 pl-10 pr-4 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus-visible:border-orange-500 dark:focus-visible:border-orange-500 focus-visible:ring-orange-500/20 transition-colors outline-none text-gray-900 dark:text-white placeholder:text-gray-400 shadow-none"
                required
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 pt-1 flex items-center gap-1.5 animate-in fade-in">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </p>
            )}
          </div>

          {/* Action Button (shadcn Button) */}
          <Button
            type="submit"
            disabled={!isFormValid || loading}
            className={cn(
              'w-full',
              isFormValid && !loading
                ? 'text-white cursor-pointer'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-800',
            )}
          >
            {loading ? 'Sending Link...' : 'Send Reset Link'}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:underline inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
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
