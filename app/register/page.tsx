'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ds';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!acceptedTerms) {
      setError('You must accept the Terms and Privacy Policy');
      return;
    }
    setLoading(true);
    try {
      await signUp(email.trim(), password);
      const normalizedEmail = email.trim().toLowerCase();
      router.push(`/verify-email?email=${encodeURIComponent(normalizedEmail)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
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
          Create your account
        </h1>
        <p className="font-body text-muted-foreground text-[15px] mb-8 text-center">
          Join VCI and discover quality deals
        </p>

        {error && (
          <p className="font-body text-[13px] text-destructive mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-body text-[13px] text-foreground mb-1.5 block">Full name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full font-body text-[14px] text-foreground bg-card border border-border rounded-lg py-2.5 pl-10 pr-3 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                autoComplete="name"
              />
            </div>
          </div>

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
            <label className="font-body text-[13px] text-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full font-body text-[14px] text-foreground bg-card border border-border rounded-lg py-2.5 pl-10 pr-10 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                autoComplete="new-password"
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

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 rounded border-border"
                style={{ accentColor: 'var(--primary)' }}
            />
            <span className="font-body text-[13px] text-muted-foreground">
              By signing up, you agree to the{' '}
              <Link href="/terms" className="text-primary no-underline hover:underline">Terms</Link> and{' '}
              <Link href="/privacy" className="text-primary no-underline hover:underline">Privacy Policy</Link>.
            </span>
          </label>

          <Button type="submit" variant="primary" animated={false} className="w-full rounded-lg" style={{ height: 44 }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="font-body text-[13px] text-muted-foreground text-center mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary no-underline hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
