'use client';

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, Heading, Text } from '@/design-system';
import { designTokens } from '@/lib/theme/tokens';

interface PurchaseData {
  created_at: string;
  seller_revenue: string | number;
  status: string;
}

interface RevenueLineChartProps {
  purchases?: PurchaseData[];
  loading?: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

export const RevenueLineChart: React.FC<RevenueLineChartProps> = ({
  purchases = [],
  loading = false,
  startDate,
  endDate,
}) => {
  const chartData = useMemo(() => {
    if (!purchases || purchases.length === 0) {
      return { dates: [], revenues: [], cumulative: [] };
    }

    // Filter by date range and status
    const filtered = purchases.filter((p) => {
      if (p.status !== 'completed') return false;
      if (!startDate && !endDate) return true;
      
      const purchaseDate = new Date(p.created_at);
      if (startDate && purchaseDate < new Date(startDate)) return false;
      if (endDate && purchaseDate > new Date(endDate)) return false;
      return true;
    });

    // Group by date and calculate cumulative revenue
    const dateMap = new Map<string, number>();
    
    filtered.forEach((p) => {
      const date = new Date(p.created_at).toISOString().split('T')[0];
      const revenue = typeof p.seller_revenue === 'string' 
        ? parseFloat(p.seller_revenue) 
        : p.seller_revenue;
      
      dateMap.set(date, (dateMap.get(date) || 0) + revenue);
    });

    // Sort dates and calculate cumulative
    const sortedDates = Array.from(dateMap.keys()).sort();
    const revenues: number[] = [];
    const cumulative: number[] = [];
    let runningTotal = 0;

    sortedDates.forEach((date) => {
      const dailyRevenue = dateMap.get(date) || 0;
      runningTotal += dailyRevenue;
      revenues.push(dailyRevenue);
      cumulative.push(runningTotal);
    });

    return {
      dates: sortedDates,
      revenues,
      cumulative,
    };
  }, [purchases, startDate, endDate]);

  const option = useMemo(() => {
    if (chartData.dates.length === 0) {
      return null;
    }

    return {
      backgroundColor: 'transparent',
      textStyle: {
        color: designTokens.colors.text.primary,
        fontFamily: designTokens.typography.fontFamily.primary,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: designTokens.colors.surface.elevated,
        borderColor: designTokens.colors.surface.border,
        textStyle: {
          color: designTokens.colors.text.primary,
        },
        formatter: (params: any) => {
          const param = params[0];
          return `
            <div style="padding: 8px;">
              <div style="margin-bottom: 4px;"><strong>${param.axisValue}</strong></div>
              <div>Daily Revenue: <strong>$${param.value.toFixed(2)}</strong></div>
              <div>Cumulative: <strong>$${chartData.cumulative[param.dataIndex].toFixed(2)}</strong></div>
            </div>
          `;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.dates,
        axisLine: {
          lineStyle: {
            color: designTokens.colors.surface.border,
          },
        },
        axisLabel: {
          color: designTokens.colors.text.secondary,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: designTokens.colors.surface.border,
          },
        },
        axisLabel: {
          color: designTokens.colors.text.secondary,
          formatter: (value: number) => `$${value.toFixed(0)}`,
        },
        splitLine: {
          lineStyle: {
            color: designTokens.colors.surface.border,
            opacity: 0.3,
          },
        },
      },
      series: [
        {
          name: 'Daily Revenue',
          type: 'line',
          data: chartData.revenues,
          smooth: true,
          lineStyle: {
            color: designTokens.colors.action.primary,
            width: 2,
          },
          itemStyle: {
            color: designTokens.colors.action.primary,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: `${designTokens.colors.action.primary}40`,
                },
                {
                  offset: 1,
                  color: `${designTokens.colors.action.primary}00`,
                },
              ],
            },
          },
        },
        {
          name: 'Cumulative Revenue',
          type: 'line',
          data: chartData.cumulative,
          smooth: true,
          lineStyle: {
            color: designTokens.colors.success.main,
            width: 2,
            type: 'dashed',
          },
          itemStyle: {
            color: designTokens.colors.success.main,
          },
        },
      ],
      legend: {
        data: ['Daily Revenue', 'Cumulative Revenue'],
        textStyle: {
          color: designTokens.colors.text.secondary,
        },
        top: 10,
      },
    };
  }, [chartData]);

  if (loading) {
    return (
      <Card variant="elevated">
        <div style={{ padding: designTokens.spacing.xl, minHeight: '400px' }}>
          <Text variant="body" style={{ color: designTokens.colors.text.secondary }}>
            Loading chart data...
          </Text>
        </div>
      </Card>
    );
  }

  if (!purchases || purchases.length === 0 || chartData.dates.length === 0) {
    return (
      <Card variant="elevated">
        <div style={{ padding: designTokens.spacing.xl, minHeight: '400px' }}>
          <Heading level={3} variant="headline" style={{ marginBottom: designTokens.spacing.md }}>
            Revenue Over Time
          </Heading>
          <Text variant="body" style={{ color: designTokens.colors.text.secondary }}>
            No purchase data available for the selected date range.
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <div style={{ padding: designTokens.spacing.xl }}>
        <Heading level={3} variant="headline" style={{ marginBottom: designTokens.spacing.lg }}>
          Revenue Over Time
        </Heading>
        <ReactECharts
          option={option}
          style={{ height: '400px', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </Card>
  );
};
