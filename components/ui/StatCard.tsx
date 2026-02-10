/**
 * Stat Card Component
 * Reusable card for displaying statistics/metrics
 * Follows atomic design system principles
 */

import React from 'react';
import { Card, Heading, Text } from '@/design-system';
import { spacing } from '@/design-system/tokens';

export interface StatCardProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  className = '',
}) => {
  return (
    <>
      <style>{`
        .stat-card-wrapper {
          width: 100%;
          min-height: 100%;
          display: flex;
          margin: 0 auto;
        }
        
        /* Mobile: 280px - 100% */
        @media (max-width: 599px) {
          .stat-card-wrapper {
            min-width: 280px;
            max-width: 100%;
          }
        }
        
        /* Tablet: 280px - 300px */
        @media (min-width: 600px) and (max-width: 1199px) {
          .stat-card-wrapper {
            min-width: 280px;
            max-width: 300px;
          }
        }
        
        /* Desktop: 300px - 320px */
        @media (min-width: 1200px) {
          .stat-card-wrapper {
            min-width: 300px;
            max-width: 320px;
          }
        }
      `}</style>
      <div className={`stat-card-wrapper ${className}`}>
        <Card variant="elevated">
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {icon && (
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--surface-elevated)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing.scale.lg,
                  fontSize: '28px',
                }}
              >
                {icon}
              </div>
            )}
            <Heading
              level={2}
              variant="title1"
              style={{
                marginBottom: spacing.scale.sm,
              }}
            >
              {value}
            </Heading>
            <Text variant="body" style={{ color: 'var(--text-secondary)' }}>
              {label}
            </Text>
          </div>
        </Card>
      </div>
    </>
  );
};

