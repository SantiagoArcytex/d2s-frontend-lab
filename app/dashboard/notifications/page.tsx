'use client';

import { Heading, Text, Container, Card, Badge, IconButton } from '@/design-system';
import { designTokens } from '@/lib/theme/tokens';
import { EmptyState } from '@/components/ui/EmptyState';
import { Notifications as NotificationsIcon, MarkEmailRead as MarkReadIcon } from '@mui/icons-material';

export default function NotificationsPage() {
  // TODO: Implement notifications fetching
  type NotificationItem = {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    date: string;
  };
  const notifications: Array<NotificationItem> = [];

  return (
    <Container
      maxWidth={1200}
      style={{
        padding: `clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']}) clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']})`,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Heading
            level={1}
            variant="title1"
          >
            Notifications
          </Heading>
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            icon={<NotificationsIcon />}
            title="No notifications"
            description="You're all caught up! When you have new notifications, they'll appear here."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.map((notification: NotificationItem) => (
              <Card
                key={notification.id}
                variant="elevated">
                <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <Heading level={3} variant="headline">
                        {notification.title}
                      </Heading>
                      <Badge
                        variant={notification.type === 'success' ? 'success' : notification.type === 'warning' ? 'warning' : notification.type === 'error' ? 'error' : 'default'}
                        size="sm"
                      >
                        {notification.type}
                      </Badge>
                      {!notification.read && (
                        <Badge variant="primary" size="sm">New</Badge>
                      )}
                    </div>
                    <Text variant="body" style={{ color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
                      {notification.message}
                    </Text>
                    <Text variant="caption1" style={{ color: 'var(--muted-foreground)' }}>
                      {notification.date}
                    </Text>
                  </div>
                  {!notification.read && (
                    <IconButton
                      icon={<MarkReadIcon />}
                      aria-label="mark as read"
                      size="small"
                    />
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
