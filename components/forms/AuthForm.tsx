/**
 * AuthForm Component
 * Reusable authentication form component for login and register pages
 * Ensures consistent dimensions and UI between pages
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme, useMediaQuery } from '@mui/material';
import { Heading, Text, Container, Card, Button, Alert } from '@/design-system';
import { TextField } from '@/components/forms/TextField';
import { PasswordStrength } from '@/components/forms/PasswordStrength';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { InputAdornment, IconButton } from '@mui/material';

export interface AuthFormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'password';
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
  showPasswordToggle?: boolean;
  showPasswordStrength?: boolean;
}

export interface AuthFormProps {
  mode: 'login' | 'register';
  title: string;
  subtitle: string;
  fields: AuthFormField[];
  onSubmit: (data: Record<string, string>) => Promise<void>;
  error?: string;
  success?: string;
  loading?: boolean;
  showSocialLogin?: boolean;
  footerLinkText: string;
  footerLinkHref: string;
  footerLinkLabel: string;
  showForgotPassword?: boolean;
  showTermsCheckbox?: boolean;
  onTermsChange?: (accepted: boolean) => void;
  termsAccepted?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  title,
  subtitle,
  fields,
  onSubmit,
  error,
  success,
  loading = false,
  showSocialLogin = true,
  footerLinkText,
  footerLinkHref,
  footerLinkLabel,
  showForgotPassword = false,
  showTermsCheckbox = false,
  onTermsChange,
  termsAccepted = false,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleFieldChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const passwordField = fields.find((f) => f.type === 'password');
  const passwordValue = passwordField ? formData[passwordField.id] || '' : '';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--surface-base)',
        padding: 'clamp(1rem, 2rem, 2rem)',
      }}
    >
      <Container
        maxWidth={1200}
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 'clamp(2rem, 4rem, 4rem)',
          alignItems: isMobile ? 'center' : 'stretch',
        }}
      >
        {/* Left Column - Desktop only */}
        {!isMobile && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              maxWidth: '500px',
            }}
          >
            <div>
              <img
                src="/logod2s.svg"
                alt="DeathToSaaS"
                style={{
                  height: 'clamp(32px, 56px, 56px)',
                  width: 'auto',
                  marginBottom: '1.5rem',
                  objectFit: 'contain',
                }}
              />

              <Heading
                level={2}
                variant="title1"
                style={{
                  marginBottom: '1rem',
                }}
              >
                {title}
              </Heading>

              <Text
                variant="body"
                style={{
                  color: 'var(--text-secondary)',
                }}
              >
                {subtitle}
              </Text>
            </div>

            <Text
              variant="caption1"
              style={{
                color: 'var(--text-muted)',
              }}
            >
              © {new Date().getFullYear()} DeathToSaaS. All rights reserved.
            </Text>
          </div>
        )}

        {/* Right Column / Mobile - Form Card */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: isMobile ? '100%' : '480px',
          }}
        >
          <div
            style={{
              width: '100%',
            }}
          >
            <Card variant="elevated">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Mobile: Wordmark top */}
                {isMobile && (
                  <div style={{ textAlign: 'center' }}>
                    <Heading
                      level={1}
                      variant="title1"
                      style={{
                        marginBottom: '1rem',
                      }}
                    >
                      DeathTo<span style={{ color: 'var(--rebel-red, #FF2E2E)' }}>SaaS</span>
                    </Heading>
                  </div>
                )}

                {/* Headline + subtext */}
                <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
                  <Heading
                    level={2}
                    variant="title2"
                    style={{
                      marginBottom: '0.5rem',
                    }}
                  >
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                  </Heading>
                  <Text
                    variant="body"
                    style={{
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {mode === 'login'
                      ? 'Sign in to your account to continue'
                      : 'Sign up for a new account to get started'}
                  </Text>
                </div>

                {error && <Alert variant="error" message={error} />}
                {success && <Alert variant="success" message={success} />}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Form Fields */}
                    {fields.map((field) => {
                      const isPassword = field.type === 'password';
                      const showToggle = isPassword && field.showPasswordToggle;

                      return (
                        <div key={field.id} style={{ position: 'relative' }}>
                          <TextField
                            id={field.id}
                            name={field.name}
                            label={field.label}
                            type={showToggle && showPassword ? 'text' : field.type}
                            autoComplete={field.autoComplete}
                            required={field.required}
                            fullWidth
                            value={formData[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            InputProps={{
                              endAdornment: showToggle ? (
                                <InputAdornment position="end">
                                  <IconButton
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    sx={{
                                      color: 'var(--text-secondary)',
                                      '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                      },
                                    }}
                                  >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ) : undefined,
                            }}
                          />
                          {isPassword && field.showPasswordStrength && (
                            <div style={{ marginTop: '0.5rem' }}>
                              <PasswordStrength password={passwordValue} />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Forgot password link */}
                    {showForgotPassword && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Link
                          href="/forgot-password"
                          style={{
                            fontSize: '15px',
                            color: 'var(--action-primary)',
                            fontWeight: 500,
                            textDecoration: 'none',
                          }}
                        >
                          Forgot password?
                        </Link>
                      </div>
                    )}

                    {/* Terms checkbox */}
                    {showTermsCheckbox && onTermsChange && (
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => onTermsChange(e.target.checked)}
                          style={{
                            width: '20px',
                            height: '20px',
                            marginTop: '2px',
                            cursor: 'pointer',
                            accentColor: 'var(--action-primary)',
                          }}
                        />
                        <Text
                          variant="body"
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '15px',
                          }}
                        >
                          I agree to the{' '}
                          <Link
                            href="/terms"
                            style={{
                              color: 'var(--action-primary)',
                              textDecoration: 'none',
                            }}
                          >
                            Terms of Service
                          </Link>
                          {' '}and{' '}
                          <Link
                            href="/privacy"
                            style={{
                              color: 'var(--action-primary)',
                              textDecoration: 'none',
                            }}
                          >
                            Privacy Policy
                          </Link>
                        </Text>
                      </label>
                    )}

                    {/* Primary CTA */}
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      size="large"
                      loading={loading}
                      disabled={loading || (showTermsCheckbox && !termsAccepted)}
                    >
                      {loading
                        ? mode === 'login'
                          ? 'Signing in...'
                          : 'Creating account...'
                        : mode === 'login'
                          ? 'Sign in'
                          : 'Sign up'}
                    </Button>

                    {/* Divider */}
                    {showSocialLogin && (
                      <>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            margin: '1rem 0',
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              height: '1px',
                              background: 'var(--surface-border)',
                            }}
                          />
                          <Text variant="caption1" style={{ color: 'var(--text-muted)' }}>
                            or
                          </Text>
                          <div
                            style={{
                              flex: 1,
                              height: '1px',
                              background: 'var(--surface-border)',
                            }}
                          />
                        </div>

                        {/* Social login buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <Button variant="outline" fullWidth size="large">
                            Continue with Google
                          </Button>
                          <Button variant="outline" fullWidth size="large">
                            Continue with GitHub
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Footer link */}
                    <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
                      <Text
                        variant="body"
                        style={{
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {footerLinkText}{' '}
                        <Link
                          href={footerLinkHref}
                          style={{
                            color: 'var(--action-primary)',
                            fontWeight: 500,
                            textDecoration: 'none',
                          }}
                        >
                          {footerLinkLabel}
                        </Link>
                      </Text>
                    </div>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

