/**
 * Stepper Component
 * Based on Figma Design System
 */

import React from 'react';
import {
  Stepper as MuiStepper,
  Step,
  StepLabel,
  StepContent,
  StepperProps as MuiStepperProps,
  Typography,
} from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface StepItem {
  label: string;
  description?: string;
  optional?: boolean;
  content?: React.ReactNode;
}

export interface StepperProps extends Omit<MuiStepperProps, 'children'> {
  steps: StepItem[];
  activeStep: number;
  orientation?: 'horizontal' | 'vertical';
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  orientation = 'horizontal',
  ...props
}) => {
  return (
    <MuiStepper
      activeStep={activeStep}
      orientation={orientation}
      sx={{
        '& .MuiStepLabel-label': {
          fontFamily: designTokens.typography.fontFamily.primary,
          fontWeight: designTokens.typography.fontWeight.medium,
        },
        '& .MuiStepLabel-label.Mui-active': {
          fontWeight: designTokens.typography.fontWeight.semibold,
        },
        ...props.sx,
      }}
      {...props}
    >
      {steps.map((step, index) => (
        <Step key={index}>
          <StepLabel optional={step.optional ? <Typography variant="caption">Optional</Typography> : undefined}>
            {step.label}
          </StepLabel>
          {orientation === 'vertical' && step.content && (
            <StepContent>
              {step.content}
            </StepContent>
          )}
        </Step>
      ))}
    </MuiStepper>
  );
};
