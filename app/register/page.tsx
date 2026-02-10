'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/forms/AuthForm';
import type { AuthFormField } from '@/components/forms/AuthForm';

export default function RegisterPage() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const fields: AuthFormField[] = [
    {
      id: 'fullName',
      name: 'fullName',
      label: 'Full name',
      type: 'text',
      autoComplete: 'name',
      required: true,
      placeholder: 'John Doe',
    },
    {
      id: 'email',
      name: 'email',
      label: 'Email address',
      type: 'email',
      autoComplete: 'email',
      required: true,
      placeholder: 'you@example.com',
    },
    {
      id: 'password',
      name: 'password',
      label: 'Password',
      type: 'password',
      autoComplete: 'new-password',
      required: true,
      placeholder: '••••••••',
      showPasswordToggle: true,
      showPasswordStrength: true,
    },
  ];

  const handleSubmit = async (data: Record<string, string>) => {
    setError('');

    if (data.password && data.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!acceptedTerms) {
      setError('You must accept the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      await signUp(data.email, data.password);
      // Redirect to verify-email page with email parameter
      const normalizedEmail = data.email.trim().toLowerCase();
      router.push(`/verify-email?email=${encodeURIComponent(normalizedEmail)}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      mode="register"
      title="Get started"
      subtitle="Create your account and start using DeathToSaaS today"
      fields={fields}
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
      showSocialLogin={true}
      showTermsCheckbox={true}
      onTermsChange={setAcceptedTerms}
      termsAccepted={acceptedTerms}
      footerLinkText="Already have an account?"
      footerLinkHref="/login"
      footerLinkLabel="Sign in"
    />
  );
}
