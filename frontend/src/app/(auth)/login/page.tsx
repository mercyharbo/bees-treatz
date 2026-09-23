'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { AuthLogo } from '@/components/auth/auth-logo';
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isFormValid = email.trim().length > 0 && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid email or password.');
        setLoading(false);
        return;
      }

      setAuth(data.token, data.user);
      router.push('/');
    } catch {
      setError('Unable to reach server. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6 animate-in fade-in duration-300'>
      {/* Brand Header */}
      <div className='flex justify-center'>
        <AuthLogo />
      </div>

      {/* Heading */}
      <div className='text-center space-y-1.5 pt-2'>
        <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white'>
          Welcome Back!
        </h1>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Don&apos;t have an account?{' '}
          <Link
            href='/register'
            className='font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-500 hover:underline'
          >
            Sign Up
          </Link>
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className='space-y-4 pt-2'>
        {/* Email Field */}
        <div className='space-y-1.5'>
          <Label
            htmlFor='login-email'
            className='text-xs font-semibold text-gray-700 dark:text-gray-300'
          >
            Email
          </Label>
          <div className='relative flex items-center'>
            <Mail className='absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none z-10' />
            <Input
              id='login-email'
              type='email'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder='Type your email address'
              className={cn(
                'h-11 pl-10 pr-4 rounded-xl text-sm bg-white dark:bg-gray-900 border transition-colors outline-none text-gray-900 dark:text-white placeholder:text-gray-400 shadow-none',
                error
                  ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500'
                  : 'border-gray-200 dark:border-gray-800 focus-visible:border-orange-500 dark:focus-visible:border-orange-500 focus-visible:ring-orange-500/20'
              )}
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className='space-y-1.5'>
          <Label
            htmlFor='login-password'
            className='text-xs font-semibold text-gray-700 dark:text-gray-300'
          >
            Password
          </Label>
          <div className='relative flex items-center'>
            <Lock className='absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none z-10' />
            <Input
              id='login-password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder='Type your password'
              className={cn(
                'h-11 pl-10 pr-11 rounded-xl text-sm bg-white dark:bg-gray-900 border transition-colors outline-none text-gray-900 dark:text-white placeholder:text-gray-400 shadow-none',
                error
                  ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500'
                  : 'border-gray-200 dark:border-gray-800 focus-visible:border-orange-500 dark:focus-visible:border-orange-500 focus-visible:ring-orange-500/20'
              )}
              required
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-900 p-1 z-10'
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </button>
          </div>

          {/* Inline Error Message */}
          {error && (
            <p className='text-xs font-medium text-red-500 pt-1 flex items-center gap-1.5 animate-in fade-in'>
              <span className='inline-block w-1.5 h-1.5 rounded-full bg-red-500' />
              {error}
            </p>
          )}
        </div>

        {/* Remember me & Forgot password */}
        <div className='flex items-center justify-between pt-1'>
          <Label className='flex items-center gap-2 cursor-pointer select-none'>
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked)}
              className='cursor-pointer data-checked:bg-orange-600 data-checked:border-orange-600 focus-visible:ring-orange-500/30'
            />
            <span className='text-xs font-medium text-gray-600 dark:text-gray-400'>
              Remember me
            </span>
          </Label>
          <Link
            href='/forgot-password'
            className='text-xs font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors'
          >
            Forgot password?
          </Link>
        </div>

        {/* Primary Action Button (using shadcn Button) */}
        <Button
          type='submit'
          disabled={!isFormValid || loading}
          className={cn(
            'w-full',
            isFormValid && !loading
              ? 'text-white cursor-pointer'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-800',
          )}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      {/* Or Divider */}
      <div className='flex items-center my-4'>
        <div className='flex-1 border-t border-gray-200 dark:border-gray-800' />
        <span className='px-3 text-xs text-gray-400 font-medium'>
          Or
        </span>
        <div className='flex-1 border-t border-gray-200 dark:border-gray-800' />
      </div>

      {/* Social Logins */}
      <SocialAuthButtons />

      {/* Bottom Footer Links */}
      <div className='pt-4 flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500'>
        <Link href='#' className='hover:underline'>
          Privacy Policy
        </Link>
        <span>•</span>
        <Link href='#' className='hover:underline'>
          Terms of Service
        </Link>
      </div>
    </div>
  );
}
