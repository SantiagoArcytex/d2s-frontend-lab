'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Heading, Text, Card, Button, Alert } from '@/design-system';
import { TextField } from '@/components/forms/TextField';
import { createClient } from '@/lib/supabase/client';

type ExchangeResponse = {
  token: string;
  expiresAt?: string;
  appId?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function EmbedAuthPage() {
  const params = useSearchParams();
  const appId = params.get('appId') || '';
  const embedToken = params.get('embedToken') || '';
  const pwaOrigin = params.get('pwaOrigin') || '*';
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'exchanging' | 'ready' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!appId || !embedToken) {
        setError('Missing appId or embedToken');
        setStatus('error');
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setStatus('ready');
        return;
      }

      await exchange(session.access_token);
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exchange = async (accessToken: string) => {
    setStatus('exchanging');
    setError(null);
    try {
      const res = await fetch(`${API_URL}/embed/exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-embed-app-id': appId,
        },
        body: JSON.stringify({ embedToken, appId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Exchange failed');
      }

      const data: ExchangeResponse = await res.json();
      postMessageToOpener(data);
      setStatus('ready');
      window.close();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to exchange token');
      setStatus('ready');
    }
  };

  const postMessageToOpener = (payload: ExchangeResponse) => {
    if (typeof window === 'undefined') return;
    const message = {
      type: 'EMBED_AUTH_RESULT',
      token: payload.token,
      expiresAt: payload.expiresAt,
      appId: payload.appId || appId,
    };
    try {
      window.opener?.postMessage(message, pwaOrigin || '*');
    } catch {
      window.opener?.postMessage(message, '*');
    }
  };

  const handleLogin = async () => {
    setStatus('checking');
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setStatus('ready');
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      await exchange(session.access_token);
    } else {
      setError('Login succeeded but session is missing');
      setStatus('ready');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)',
        padding: 'clamp(1rem, 2rem, 2rem)',
      }}
    >
      <Card variant="elevated">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Heading level={1} variant="title2">
            Marketplace login
          </Heading>
          <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
            Sign in to your marketplace account to continue in the external app.
          </Text>
          {error ? <Alert variant="error" message={error} /> : null}
          {status === 'exchanging' || status === 'checking' ? (
            <Alert variant="info" message="Processing…" />
          ) : null}

          {status === 'ready' && (
            <>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
              <Button variant="primary" onClick={handleLogin} disabled={!email || !password}>
                Sign in & continue
              </Button>
            </>
          )}

          <Text variant="caption1" style={{ color: 'var(--muted-foreground)' }}>
            App ID: {appId}
          </Text>
        </div>
      </Card>
    </div>
  );
}
