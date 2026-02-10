'use client';

import React, { useState } from 'react';
import { Button, Text } from '@/design-system';
import { designTokens } from '@/lib/theme/tokens';

interface DateRangeSelectorProps {
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void;
  defaultAllTime?: boolean;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onDateRangeChange,
  defaultAllTime = true,
}) => {
  const [isAllTime, setIsAllTime] = useState(defaultAllTime);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleAllTimeToggle = () => {
    setIsAllTime(true);
    setStartDate('');
    setEndDate('');
    onDateRangeChange(null, null);
  };

  const handleCustomRange = () => {
    setIsAllTime(false);
  };

  const handleApply = () => {
    if (startDate && endDate) {
      // Convert to ISO datetime strings for API
      const start = new Date(startDate).toISOString();
      const end = new Date(endDate + 'T23:59:59').toISOString();
      onDateRangeChange(start, end);
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: designTokens.spacing.lg,
        padding: designTokens.spacing.lg,
        background: designTokens.colors.surface.elevated,
        border: `1px solid ${designTokens.colors.surface.border}`,
        borderRadius: designTokens.borderRadius.md,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.md }}>
        <Text variant="body" weight="medium" style={{ color: designTokens.colors.text.primary }}>
          Date Range:
        </Text>
        <Button
          variant={isAllTime ? 'primary' : 'outline'}
          size="small"
          onClick={handleAllTimeToggle}
        >
          All Time
        </Button>
        <Button
          variant={!isAllTime ? 'primary' : 'outline'}
          size="small"
          onClick={handleCustomRange}
        >
          Custom Range
        </Button>
      </div>

      {!isAllTime && (
        <div
          style={{
            display: 'flex',
            gap: designTokens.spacing.md,
            alignItems: 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: '150px' }}>
            <Text
              variant="caption1"
              style={{
                display: 'block',
                marginBottom: designTokens.spacing.xs,
                color: designTokens.colors.text.secondary,
              }}
            >
              Start Date
            </Text>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              style={{
                width: '100%',
                padding: designTokens.spacing.md,
                background: designTokens.colors.surface.subtle,
                border: `1px solid ${designTokens.colors.surface.border}`,
                borderRadius: designTokens.borderRadius.sm,
                color: designTokens.colors.text.primary,
                fontFamily: designTokens.typography.fontFamily.primary,
                fontSize: designTokens.typography.fontSize.base,
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <Text
              variant="caption1"
              style={{
                display: 'block',
                marginBottom: designTokens.spacing.xs,
                color: designTokens.colors.text.secondary,
              }}
            >
              End Date
            </Text>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate}
              style={{
                width: '100%',
                padding: designTokens.spacing.md,
                background: designTokens.colors.surface.subtle,
                border: `1px solid ${designTokens.colors.surface.border}`,
                borderRadius: designTokens.borderRadius.sm,
                color: designTokens.colors.text.primary,
                fontFamily: designTokens.typography.fontFamily.primary,
                fontSize: designTokens.typography.fontSize.base,
              }}
            />
          </div>
          <Button
            variant="primary"
            size="small"
            onClick={handleApply}
            disabled={!startDate || !endDate}
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  );
};
