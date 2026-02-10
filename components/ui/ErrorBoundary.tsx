/**
 * ErrorBoundary Component
 * Based on Figma Design System
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';
import { Button as DesignButton } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            p: designTokens.spacing.lg,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: designTokens.spacing.md,
              fontFamily: designTokens.typography.fontFamily.heading,
              fontWeight: designTokens.typography.fontWeight.bold,
              color: designTokens.colors.error.main,
            }}
          >
            Something went wrong
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: designTokens.spacing.lg,
              fontFamily: designTokens.typography.fontFamily.primary,
            }}
          >
            {this.state.error?.message || 'An unexpected error occurred'}
          </Typography>
          <DesignButton variant="primary" onClick={this.handleReset}>
            Try Again
          </DesignButton>
        </Box>
      );
    }

    return this.props.children;
  }
}
