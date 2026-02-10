'use client';

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, Heading, Text } from '@/design-system';
import { designTokens } from '@/lib/theme/tokens';

interface DealStat {
  deal_id: string;
  deal_title: string;
  totalSellerRevenue: number;
  totalRevenue: number;
  completedPurchases: number;
}

interface RevenueDistributionChartProps {
  dealStats?: DealStat[];
  loading?: boolean;
}

export const RevenueDistributionChart: React.FC<RevenueDistributionChartProps> = ({
  dealStats = [],
  loading = false,
}) => {
  const chartData = useMemo(() => {
    if (!dealStats || dealStats.length === 0) {
      return [];
    }

    return dealStats
      .filter((deal) => deal.totalSellerRevenue > 0)
      .map((deal) => ({
        name: deal.deal_title.length > 30 
          ? `${deal.deal_title.substring(0, 30)}...` 
          : deal.deal_title,
        value: typeof deal.totalSellerRevenue === 'string'
          ? parseFloat(deal.totalSellerRevenue)
          : deal.totalSellerRevenue,
        fullName: deal.deal_title,
        purchases: deal.completedPurchases,
      }))
      .sort((a, b) => b.value - a.value);
  }, [dealStats]);

  const totalRevenue = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  const option = useMemo(() => {
    if (chartData.length === 0) {
      return null;
    }

    // Generate colors for chart slices
    const colors = [
      designTokens.colors.action.primary,
      designTokens.colors.success.main,
      '#F59E0B', // warning color
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#06B6D4', // cyan
    ];

    return {
      backgroundColor: 'transparent',
      textStyle: {
        color: designTokens.colors.text.primary,
        fontFamily: designTokens.typography.fontFamily.primary,
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: designTokens.colors.surface.elevated,
        borderColor: designTokens.colors.surface.border,
        textStyle: {
          color: designTokens.colors.text.primary,
        },
        formatter: (params: any) => {
          const data = params.data;
          const percentage = ((data.value / totalRevenue) * 100).toFixed(1);
          return `
            <div style="padding: 8px;">
              <div style="margin-bottom: 4px;"><strong>${data.fullName}</strong></div>
              <div>Revenue: <strong>$${data.value.toFixed(2)}</strong></div>
              <div>Percentage: <strong>${percentage}%</strong></div>
              <div>Purchases: <strong>${data.purchases}</strong></div>
            </div>
          `;
        },
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        textStyle: {
          color: designTokens.colors.text.secondary,
          fontSize: 12,
        },
        formatter: (name: string) => {
          const item = chartData.find((d) => d.name === name);
          if (!item) return name;
          const percentage = ((item.value / totalRevenue) * 100).toFixed(1);
          return `${name} (${percentage}%)`;
        },
      },
      series: [
        {
          name: 'Revenue Distribution',
          type: 'pie',
          radius: ['40%', '70%'], // Donut chart
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: designTokens.colors.surface.base,
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: (params: any) => {
              const percentage = ((params.value / totalRevenue) * 100).toFixed(1);
              return `${percentage}%`;
            },
            color: designTokens.colors.text.primary,
            fontSize: 12,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          data: chartData.map((item, index) => ({
            ...item,
            itemStyle: {
              color: colors[index % colors.length],
            },
          })),
        },
      ],
    };
  }, [chartData, totalRevenue]);

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

  if (!dealStats || dealStats.length === 0 || chartData.length === 0) {
    return (
      <Card variant="elevated">
        <div style={{ padding: designTokens.spacing.xl, minHeight: '400px' }}>
          <Heading level={3} variant="headline" style={{ marginBottom: designTokens.spacing.md }}>
            Revenue Distribution
          </Heading>
          <Text variant="body" style={{ color: designTokens.colors.text.secondary }}>
            No revenue data available to display.
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <div style={{ padding: designTokens.spacing.xl }}>
        <Heading level={3} variant="headline" style={{ marginBottom: designTokens.spacing.lg }}>
          Revenue Distribution by Deal
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
