/**
 * Password Strength Indicator Component
 */

import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const getPasswordStrength = (pwd: string): { strength: number; label: string; color: string } => {
    if (!pwd) return { strength: 0, label: '', color: designTokens.colors.text.muted };

    let strength = 0;
    
    // Length check
    if (pwd.length >= 6) strength += 20;
    if (pwd.length >= 8) strength += 10;
    if (pwd.length >= 12) strength += 10;
    
    // Character variety
    if (/[a-z]/.test(pwd)) strength += 15;
    if (/[A-Z]/.test(pwd)) strength += 15;
    if (/[0-9]/.test(pwd)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 15;

    let label = '';
    let color: string = designTokens.colors.error.main;

    if (strength < 40) {
      label = 'Weak';
      color = designTokens.colors.error.main;
    } else if (strength < 70) {
      label = 'Fair';
      color = designTokens.colors.warning.main;
    } else if (strength < 90) {
      label = 'Good';
      color = designTokens.colors.action.primary; // Using Action/Primary instead of info
    } else {
      label = 'Strong';
      color = designTokens.colors.success.main;
    }

    return { strength: Math.min(strength, 100), label, color };
  };

  const { strength, label, color } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Password strength
        </Typography>
        <Typography variant="caption" sx={{ color, fontWeight: designTokens.typography.fontWeight.semibold }}>
          {label}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={strength}
        sx={{
          height: 6,
          borderRadius: designTokens.borderRadius.full,
          backgroundColor: designTokens.colors.surface.subtle,
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
            borderRadius: designTokens.borderRadius.full,
          },
        }}
      />
    </Box>
  );
};
