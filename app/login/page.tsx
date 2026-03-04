'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ds';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const verified = params.get('verified');
    const reset = params.get('reset');
    if (verified === 'success') {
      setSuccess('Email verified successfully! You can now sign in.');
      window.history.replaceState({}, '', '/login');
    } else if (reset === 'success') {
      setSuccess('Password reset successful! You can now sign in with your new password.');
      window.history.replaceState({}, '', '/login');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!email?.trim() || !password) {
        setError('Please enter both email and password');
        setLoading(false);
        return;
      }
      await signIn(email.trim(), password);
      router.push('/dashboard/home');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign in. Please check your credentials.';
      setError(message.includes('Invalid login credentials') ? 'Invalid email or password. Please verify your credentials or try resetting your password.' : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full"
      >
        <h1 className="font-heading text-foreground text-[28px] font-semibold mb-2 text-center">
          Welcome back
        </h1>
        <p className="font-body text-muted-foreground text-[15px] mb-8 text-center">
          Sign in to your account to continue
        </p>

        {success && (
          <p className="font-body text-[13px] text-success mb-4">
            {success}
          </p>
        )}
        {error && (
          <p className="font-body text-[13px] text-destructive mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-body text-[13px] text-foreground mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full font-body text-[14px] text-foreground bg-card border border-border rounded-lg py-2.5 pl-10 pr-3 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-body text-[13px] text-foreground">Password</label>
              <Link href="/forgot-password" className="font-body text-[12px] text-primary no-underline hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full font-body text-[14px] text-foreground bg-card border border-border rounded-lg py-2.5 pl-10 pr-10 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer bg-transparent border-none text-muted-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" animated={false} className="w-full rounded-lg" style={{ height: 44 }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="font-body text-[13px] text-muted-foreground text-center mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary no-underline hover:underline">Create one</Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
