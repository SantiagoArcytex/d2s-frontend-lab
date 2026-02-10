'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/forms/AuthForm';
import type { AuthFormField } from '@/components/forms/AuthForm';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  // Check for verification success or other URL params
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const params = new URLSearchParams(window.location.search);
    const verified = params.get('verified');
    const reset = params.get('reset');
    
    if (verified === 'success') {
      setSuccess('Email verified successfully! You can now sign in.');
      // Clean up URL
      window.history.replaceState({}, '', '/login');
    } else if (reset === 'success') {
      setSuccess('Password reset successful! You can now sign in with your new password.');
      // Clean up URL
      window.history.replaceState({}, '', '/login');
    }
  }, []);

  const fields: AuthFormField[] = [
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
      autoComplete: 'current-password',
      required: true,
      placeholder: '••••••••',
      showPasswordToggle: true,
    },
  ];

  const handleSubmit = async (data: Record<string, string>) => {
    setError('');
    setLoading(true);

    try {
      if (!data.email || !data.password) {
        setError('Please enter both email and password');
        setLoading(false);
        return;
      }
      
      await signIn(data.email, data.password);
      router.push('/dashboard/home');
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Extract a user-friendly error message
      let errorMessage = err.message || 'Failed to sign in. Please check your credentials.';
      
      // If it's the detailed error message we created, use it as-is
      // Otherwise, provide a more helpful message
      if (errorMessage.includes('Invalid email or password')) {
        errorMessage = errorMessage;
      } else if (err.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please verify your credentials or try resetting your password.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      mode="login"
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      fields={fields}
      onSubmit={handleSubmit}
      error={error}
      success={success}
      loading={loading}
      showSocialLogin={true}
      showForgotPassword={true}
      footerLinkText="Don't have an account?"
      footerLinkHref="/register"
      footerLinkLabel="Sign up"
    />
  );
}
