'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heading, Text, Container, Card, Button, Label, Badge } from '@/design-system';
import { SectionLoader } from '@/components/feedback/SectionLoader';
import { designTokens } from '@/lib/theme/tokens';
import { Switch } from '@/components/forms/Switch';
import { Tabs } from '@/components/navigation/Tabs';
import { useAuth } from '@/contexts/AuthContext';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  VerifiedUser as VerifiedUserIcon,
  CalendarToday as CalendarIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Lock as LockIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  });

  const tabs = [
    { 
      label: 'Profile', 
      value: 'profile',
      icon: <PersonIcon style={{ fontSize: '18px' }} />,
    },
    { 
      label: 'Notifications', 
      value: 'notifications',
      icon: <NotificationsIcon style={{ fontSize: '18px' }} />,
    },
    { 
      label: 'Security', 
      value: 'security',
      icon: <SecurityIcon style={{ fontSize: '18px' }} />,
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return <SectionLoader />;
  }

  if (!user) {
    return null;
  }

  return (
    <Container 
      maxWidth={800} 
      style={{ 
        padding: `clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']}) clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']})`,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing['2xl'] }}>
        {/* Header */}
        <div>
          <Heading
            level={1}
            variant="largeTitle"
            style={{
              fontSize: 'clamp(1.75rem, 2.5rem, 2.5rem)',
              marginBottom: designTokens.spacing.sm,
              color: designTokens.colors.text.primary,
            }}
          >
            Settings
          </Heading>
          <Text variant="body" style={{ color: designTokens.colors.text.secondary }}>
            Manage your account settings and preferences
          </Text>
        </div>

        {/* Tabs */}
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <Tabs
            items={tabs}
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            sx={{
              marginBottom: designTokens.spacing.lg,
              borderBottom: `1px solid ${designTokens.colors.surface.border}`,
              width: '100%',
            }}
          />
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card
            variant="elevated"
          >
            <div style={{ 
              padding: designTokens.spacing['2xl'],
              display: 'flex', 
              flexDirection: 'column', 
              gap: designTokens.spacing.xl 
            }}>
              {/* Profile Header */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: designTokens.spacing.md,
                  paddingBottom: designTokens.spacing.xl,
                  borderBottom: `1px solid ${designTokens.colors.surface.border}`,
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: designTokens.colors.surface.subtle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${designTokens.colors.surface.border}`,
                  }}
                >
                  <PersonIcon
                    style={{
                      fontSize: '40px',
                      color: designTokens.colors.action.primary,
                    }}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Heading
                    level={2}
                    variant="title2"
                    style={{
                      marginBottom: designTokens.spacing.xs,
                      color: designTokens.colors.text.primary,
                    }}
                  >
                    Account Profile
                  </Heading>
                  <Text variant="body" style={{ color: designTokens.colors.text.secondary }}>
                    View and manage your account information
                  </Text>
                </div>
              </div>

              {/* Account Information Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: designTokens.spacing.lg,
                }}
              >
                {/* Email */}
                <div
                  style={{
                    padding: designTokens.spacing.lg,
                    background: designTokens.colors.surface.subtle,
                    borderRadius: designTokens.borderRadius.md,
                    border: `1px solid ${designTokens.colors.surface.border}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: designTokens.spacing.md,
                      marginBottom: designTokens.spacing.sm,
                    }}
                  >
                    <EmailIcon
                      style={{
                        fontSize: '20px',
                        color: designTokens.colors.action.primary,
                      }}
                    />
                    <Label
                      style={{
                        color: designTokens.colors.text.secondary,
                        fontSize: designTokens.typography.fontSize.sm,
                      }}
                    >
                      Email Address
                    </Label>
                  </div>
                  <Text
                    variant="body"
                    weight="medium"
                    style={{
                      color: designTokens.colors.text.primary,
                      wordBreak: 'break-word',
                    }}
                  >
                    {user.email}
                  </Text>
                </div>

                {/* Email Verification */}
                <div
                  style={{
                    padding: designTokens.spacing.lg,
                    background: designTokens.colors.surface.subtle,
                    borderRadius: designTokens.borderRadius.md,
                    border: `1px solid ${designTokens.colors.surface.border}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: designTokens.spacing.md,
                      marginBottom: designTokens.spacing.sm,
                    }}
                  >
                    <VerifiedUserIcon
                      style={{
                        fontSize: '20px',
                        color: user.email_confirmed_at
                          ? designTokens.colors.success.main
                          : designTokens.colors.warning.main,
                      }}
                    />
                    <Label
                      style={{
                        color: designTokens.colors.text.secondary,
                        fontSize: designTokens.typography.fontSize.sm,
                      }}
                    >
                      Email Status
                    </Label>
                  </div>
                  {user.email_confirmed_at ? (
                    <Badge variant="success" size="sm">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="sm">
                      Not verified
                    </Badge>
                  )}
                </div>

                {/* User ID */}
                <div
                  style={{
                    padding: designTokens.spacing.lg,
                    background: designTokens.colors.surface.subtle,
                    borderRadius: designTokens.borderRadius.md,
                    border: `1px solid ${designTokens.colors.surface.border}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: designTokens.spacing.md,
                      marginBottom: designTokens.spacing.sm,
                    }}
                  >
                    <PersonIcon
                      style={{
                        fontSize: '20px',
                        color: designTokens.colors.action.primary,
                      }}
                    />
                    <Label
                      style={{
                        color: designTokens.colors.text.secondary,
                        fontSize: designTokens.typography.fontSize.sm,
                      }}
                    >
                      User ID
                    </Label>
                  </div>
                  <Text
                    variant="caption1"
                    style={{
                      fontFamily: designTokens.typography.fontFamily.mono,
                      wordBreak: 'break-all',
                      color: designTokens.colors.text.secondary,
                    }}
                  >
                    {user.id}
                  </Text>
                </div>

                {/* Created At */}
                <div
                  style={{
                    padding: designTokens.spacing.lg,
                    background: designTokens.colors.surface.subtle,
                    borderRadius: designTokens.borderRadius.md,
                    border: `1px solid ${designTokens.colors.surface.border}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: designTokens.spacing.md,
                      marginBottom: designTokens.spacing.sm,
                    }}
                  >
                    <CalendarIcon
                      style={{
                        fontSize: '20px',
                        color: designTokens.colors.action.primary,
                      }}
                    />
                    <Label
                      style={{
                        color: designTokens.colors.text.secondary,
                        fontSize: designTokens.typography.fontSize.sm,
                      }}
                    >
                      Member Since
                    </Label>
                  </div>
                  <Text variant="body" weight="medium" style={{ color: designTokens.colors.text.primary }}>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <Card
            variant="elevated"
          >
            <div style={{ 
              padding: designTokens.spacing['2xl'],
              display: 'flex', 
              flexDirection: 'column', 
              gap: designTokens.spacing.xl 
            }}>
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: designTokens.spacing.md,
                  paddingBottom: designTokens.spacing.xl,
                  borderBottom: `1px solid ${designTokens.colors.surface.border}`,
                }}
              >
                <NotificationsIcon
                  style={{
                    fontSize: '28px',
                    color: designTokens.colors.action.primary,
                  }}
                />
                <div>
                  <Heading
                    level={2}
                    variant="title2"
                    style={{
                      marginBottom: designTokens.spacing.xs,
                      color: designTokens.colors.text.primary,
                    }}
                  >
                    Notification Preferences
                  </Heading>
                  <Text variant="body" style={{ color: designTokens.colors.text.secondary }}>
                    Control how and when you receive notifications
                  </Text>
                </div>
              </div>

              {/* Notification Switches */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: designTokens.spacing.lg,
                }}
              >
                <div
                  style={{
                    padding: designTokens.spacing.lg,
                    background: designTokens.colors.surface.subtle,
                    borderRadius: designTokens.borderRadius.md,
                    border: `1px solid ${designTokens.colors.surface.border}`,
                  }}
                >
                  <Switch
                    label="Email Notifications"
                    checked={notifications.email}
                    onChange={(e) =>
                      setNotifications({ ...notifications, email: e.target.checked })
                    }
                  />
                  <Text
                    variant="caption1"
                    style={{
                      color: designTokens.colors.text.muted,
                      marginTop: designTokens.spacing.xs,
                      display: 'block',
                    }}
                  >
                    Receive email notifications for important account updates
                  </Text>
                </div>

                <div
                  style={{
                    padding: designTokens.spacing.lg,
                    background: designTokens.colors.surface.subtle,
                    borderRadius: designTokens.borderRadius.md,
                    border: `1px solid ${designTokens.colors.surface.border}`,
                  }}
                >
                  <Switch
                    label="Push Notifications"
                    checked={notifications.push}
                    onChange={(e) =>
                      setNotifications({ ...notifications, push: e.target.checked })
                    }
                  />
                  <Text
                    variant="caption1"
                    style={{
                      color: designTokens.colors.text.muted,
                      marginTop: designTokens.spacing.xs,
                      display: 'block',
                    }}
                  >
                    Get real-time push notifications in your browser
                  </Text>
                </div>

                <div
                  style={{
                    padding: designTokens.spacing.lg,
                    background: designTokens.colors.surface.subtle,
                    borderRadius: designTokens.borderRadius.md,
                    border: `1px solid ${designTokens.colors.surface.border}`,
                  }}
                >
                  <Switch
                    label="Marketing Emails"
                    checked={notifications.marketing}
                    onChange={(e) =>
                      setNotifications({ ...notifications, marketing: e.target.checked })
                    }
                  />
                  <Text
                    variant="caption1"
                    style={{
                      color: designTokens.colors.text.muted,
                      marginTop: designTokens.spacing.xs,
                      display: 'block',
                    }}
                  >
                    Receive updates about new features and special offers
                  </Text>
                </div>
              </div>

              {/* Save Button */}
              <div
                style={{
                  paddingTop: designTokens.spacing.lg,
                  borderTop: `1px solid ${designTokens.colors.surface.border}`,
                }}
              >
                <Button variant="primary" size="medium">
                  Save Preferences
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <Card
            variant="elevated"
          >
            <div style={{ 
              padding: designTokens.spacing['2xl'],
              display: 'flex', 
              flexDirection: 'column', 
              gap: designTokens.spacing.xl 
            }}>
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: designTokens.spacing.md,
                  paddingBottom: designTokens.spacing.xl,
                  borderBottom: `1px solid ${designTokens.colors.surface.border}`,
                }}
              >
                <SecurityIcon
                  style={{
                    fontSize: '28px',
                    color: designTokens.colors.action.primary,
                  }}
                />
                <div>
                  <Heading
                    level={2}
                    variant="title2"
                    style={{
                      marginBottom: designTokens.spacing.xs,
                      color: designTokens.colors.text.primary,
                    }}
                  >
                    Security Settings
                  </Heading>
                  <Text variant="body" style={{ color: designTokens.colors.text.secondary }}>
                    Manage your account security and authentication
                  </Text>
                </div>
              </div>

              {/* Security Options */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: designTokens.spacing.md,
                }}
              >
                <div
                  style={{
                    padding: designTokens.spacing.lg,
                    background: designTokens.colors.surface.subtle,
                    borderRadius: designTokens.borderRadius.md,
                    border: `1px solid ${designTokens.colors.surface.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: designTokens.spacing.md,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.md }}>
                    <LockIcon
                      style={{
                        fontSize: '20px',
                        color: designTokens.colors.action.primary,
                      }}
                    />
                    <div>
                      <Text variant="body" weight="medium" style={{ color: designTokens.colors.text.primary }}>
                        Change Password
                      </Text>
                      <Text
                        variant="caption1"
                        style={{
                          color: designTokens.colors.text.secondary,
                          display: 'block',
                          marginTop: designTokens.spacing.xs,
                        }}
                      >
                        Update your password to keep your account secure
                      </Text>
                    </div>
                  </div>
                  <Button variant="outline" size="small">
                    Change
                  </Button>
                </div>

                <div
                  style={{
                    padding: designTokens.spacing.lg,
                    background: designTokens.colors.surface.subtle,
                    borderRadius: designTokens.borderRadius.md,
                    border: `1px solid ${designTokens.colors.surface.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: designTokens.spacing.md,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.md }}>
                    <ShieldIcon
                      style={{
                        fontSize: '20px',
                        color: designTokens.colors.action.primary,
                      }}
                    />
                    <div>
                      <Text variant="body" weight="medium" style={{ color: designTokens.colors.text.primary }}>
                        Two-Factor Authentication
                      </Text>
                      <Text
                        variant="caption1"
                        style={{
                          color: designTokens.colors.text.secondary,
                          display: 'block',
                          marginTop: designTokens.spacing.xs,
                        }}
                      >
                        Add an extra layer of security to your account
                      </Text>
                    </div>
                  </div>
                  <Button variant="outline" size="small">
                    Enable
                  </Button>
                </div>
              </div>

              {/* Account Actions */}
              <div
                style={{
                  paddingTop: designTokens.spacing.xl,
                  borderTop: `1px solid ${designTokens.colors.surface.border}`,
                }}
              >
                <Heading
                  level={3}
                  variant="headline"
                  style={{
                    marginBottom: designTokens.spacing.lg,
                    color: designTokens.colors.text.primary,
                  }}
                >
                  Account Actions
                </Heading>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: designTokens.spacing.sm,
                    color: designTokens.colors.error.main,
                    borderColor: designTokens.colors.error.main,
                  }}
                >
                  <LogoutIcon style={{ fontSize: '18px' }} />
                  Sign Out
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Container>
  );
}
