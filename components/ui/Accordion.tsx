/**
 * Accordion Component
 * Based on Figma Design System
 */

import React from 'react';
import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  AccordionProps as MuiAccordionProps,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { designTokens } from '@/lib/theme/tokens';

export interface AccordionProps extends Omit<MuiAccordionProps, 'children'> {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultExpanded = false,
  ...props
}) => {
  return (
    <MuiAccordion
      defaultExpanded={defaultExpanded}
      sx={{
        backgroundColor: designTokens.colors.background.paper,
        borderRadius: `${designTokens.borderRadius.md} !important`,
        '&:before': {
          display: 'none',
        },
        boxShadow: designTokens.shadows.sm,
        '&.Mui-expanded': {
          margin: 0,
        },
        ...props.sx,
      }}
      {...props}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: designTokens.colors.text.secondary }} />}
        sx={{
          fontFamily: designTokens.typography.fontFamily.heading,
          fontWeight: designTokens.typography.fontWeight.semibold,
        }}
      >
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          pt: 2,
          fontFamily: designTokens.typography.fontFamily.primary,
        }}
      >
        {children}
      </AccordionDetails>
    </MuiAccordion>
  );
};
