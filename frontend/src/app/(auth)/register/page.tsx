'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { AuthLogo } from '@/components/auth/auth-logo';
import {
  PasswordStrengthBar,
  isPasswordSecure,
} from '@/components/auth/password-strength-bar';
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isFormValid =
    name.trim().length > 1 && email.includes('@') && isPasswordSecure(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account.');
        setLoading(false);
        return;
      }

      router.push(`/verify-email?registered=true&email=${encodeURIComponent(email.trim())}`);
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
          Good Morning!
        </h1>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-500 hover:underline'
          >
            Sign In
          </Link>
        </p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className='space-y-4 pt-2'>
        {/* Name Field */}
        <div className='space-y-1.5'>
          <Label
            htmlFor='register-name'
            className='text-xs font-semibold text-gray-700 dark:text-gray-300'
          >
            Name
          </Label>
          <div className='relative flex items-center'>
            <User className='absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none z-10' />
            <Input
              id='register-name'
              type='text'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder='Type your full name'
              className='h-11 pl-10 pr-4 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus-visible:border-orange-500 dark:focus-visible:border-orange-500 focus-visible:ring-orange-500/20 transition-colors outline-none text-gray-900 dark:text-white placeholder:text-gray-400 shadow-none'
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div className='space-y-1.5'>
          <Label
            htmlFor='register-email'
            className='text-xs font-semibold text-gray-700 dark:text-gray-300'
          >
            Email
          </Label>
          <div className='relative flex items-center'>
            <Mail className='absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none z-10' />
            <Input
              id='register-email'
              type='email'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder='Type your email address'
              className='h-11 pl-10 pr-4 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus-visible:border-orange-500 dark:focus-visible:border-orange-500 focus-visible:ring-orange-500/20 transition-colors outline-none text-gray-900 dark:text-white placeholder:text-gray-400 shadow-none'
              required
            />
          </div>
        </div>

        {/* Password Field & 4-bar Strength Indicator */}
        <div className='space-y-1.5'>
          <Label
            htmlFor='register-password'
            className='text-xs font-semibold text-gray-700 dark:text-gray-300'
          >
            Password
          </Label>
          <div className='relative flex items-center'>
            <Lock className='absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none z-10' />
            <Input
              id='register-password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder='Type your password (min 8 chars)'
              className='h-11 pl-10 pr-11 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus-visible:border-orange-500 dark:focus-visible:border-orange-500 focus-visible:ring-orange-500/20 transition-colors outline-none text-gray-900 dark:text-white placeholder:text-gray-400 shadow-none'
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

          {/* Password Strength Meter & Requirement Checklist */}
          <PasswordStrengthBar password={password} />

          {/* Inline Error Message */}
          {error && (
            <p className='text-xs font-medium text-red-500 pt-1 flex items-center gap-1.5 animate-in fade-in'>
              <span className='inline-block w-1.5 h-1.5 rounded-full bg-red-500' />
              {error}
            </p>
          )}
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
          {loading ? 'Creating Account...' : 'Sign Up'}
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

      {/* Terms of Service Disclaimer */}
      <p className='text-center text-xs text-gray-400 dark:text-gray-500 pt-3'>
        By clicking Sign up, you agree to accept Bee&apos;s Treatz{' '}
        <Link href='#' className='font-semibold text-gray-700 dark:text-gray-300 hover:underline'>
          Terms of Service
        </Link>
      </p>
    </div>
  );
}
