'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { trpc } from '@/lib/trpc/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const onboardMutation = (trpc as any).user.onboard.useMutation();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    const trimmedEmail = email.trim();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', {
        message: error.message,
        status: error.status,
        name: error.name,
        email: trimmedEmail,
      });
      
      // Provide more helpful error messages
      if (error.message === 'Invalid login credentials') {
        throw new Error(
          'Invalid email or password. Please check:\n' +
          '1. The email address is correct\n' +
          '2. The password is correct\n' +
          '3. The account exists in Supabase Auth\n' +
          '4. The account email is confirmed (check Supabase Dashboard)\n' +
          '5. Try resetting the password if needed'
        );
      }
      
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/confirm`,
      },
    });
    if (error) throw error;
    
    // After successful signup, call onboarding to create tenant and user record
    // This is the alternative to the database trigger approach
    // Note: Only call if user was created (data.user exists)
    if (data.user) {
      try {
        await onboardMutation.mutateAsync();
      } catch (onboardError) {
        // Log error but don't fail signup - user can still log in
        // The database trigger approach is more reliable for this reason
        console.error('Failed to onboard user after signup:', onboardError);
        // Optionally, you could throw the error here to fail signup
        // throw onboardError;
      }
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    if (!email) {
      throw new Error('Email is required');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/confirm`,
    });

    if (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
