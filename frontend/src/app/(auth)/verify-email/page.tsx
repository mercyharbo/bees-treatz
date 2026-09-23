'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AuthLogo } from '@/components/auth/auth-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [verifying, setVerifying] = useState(!!token);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Automatically attempt verification if token is present in URL
  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    async function verify() {
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        let data: any = null;
        try {
          data = await res.json();
        } catch {
          // Non-JSON response
        }

        if (isMounted) {
          if (res.ok) {
            setVerified(true);
            setError(null);
          } else {
            const errorMsg =
              data?.error ||
              data?.message ||
              (res.status === 400
                ? 'Invalid or expired verification link.'
                : 'Unable to verify email.');
            setError(errorMsg);
          }
          setVerifying(false);
        }
      } catch {
        if (isMounted) {
          setError('Unable to verify email. Please check your connection.');
          setVerifying(false);
        }
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResend = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address to resend confirmation.');
      return;
    }

    setError(null);
    setResending(true);

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // Non-JSON response
      }

      if (!res.ok) {
        const errorMsg =
          data?.error ||
          data?.message ||
          (res.status === 429
            ? 'Too many resend requests. Please wait a few minutes and try again.'
            : 'Failed to resend verification email.');
        setError(errorMsg);
      } else {
        setResent(true);
      }
    } catch {
      setError('Unable to reach server. Please check your connection.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Brand Header */}
      <div className="flex justify-center">
        <AuthLogo />
      </div>

      {/* Heading & Instructions */}
      <div className="text-center space-y-3 pt-4">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {verified ? 'Email Verified!' : 'Confirm your email address'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
          {verified
            ? 'Your email has been verified successfully. Your account is active and ready!'
            : "Please check your email for a confirmation link. Didn't receive the email? We can send you another."}
        </p>
      </div>

      {/* Verification in progress */}
      {verifying && (
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          Verifying your email address, please wait...
        </div>
      )}

      {/* Verified Success State */}
      {verified && (
        <div className="space-y-6 pt-2">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
              <p className="font-semibold">Account Verified</p>
              <p>You can now sign in and place your orders with Bee&apos;s Treatz.</p>
            </div>
          </div>

          <Button asChild className="w-full text-white cursor-pointer">
            <Link href="/login">
              <span>Sign In Now</span>
            </Link>
          </Button>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs font-semibold text-red-700 dark:text-red-400 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Resent Confirmation feedback */}
      {resent && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>A fresh verification link has been sent to your inbox!</span>
        </div>
      )}

      {!verified && !verifying && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="verify-email-input" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none z-10" />
              <Input
                id="verify-email-input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter your email address"
                className="h-11 pl-10 pr-4 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus-visible:border-orange-500 dark:focus-visible:border-orange-500 focus-visible:ring-orange-500/20 transition-colors outline-none text-gray-900 dark:text-white placeholder:text-gray-400 shadow-none"
              />
            </div>
          </div>

          {/* Resend Action Button */}
          <Button
            type="button"
            onClick={handleResend}
            disabled={resending || !email.includes('@')}
            className={cn(
              'w-full',
              !resending && email.includes('@')
                ? 'text-white cursor-pointer'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-800',
            )}
          >
            {resending ? 'Sending...' : 'Resend Confirmation Email'}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      )}

      {/* Bottom Footer Links */}
      <div className="pt-12 flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-sm text-gray-500">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
