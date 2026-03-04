'use client';

import React, { useState } from 'react';
import { Heading, Text, Container, Card, Button, Badge, Alert, Modal } from '@/design-system';
import { designTokens } from '@/lib/theme/tokens';
import {
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Shield as ShieldIcon,
  ShieldOutlined as ShieldOutlinedIcon,
} from '@mui/icons-material';
import { trpc } from '@/lib/trpc/client';
import { SectionLoader } from '@/components/feedback/SectionLoader';
import { useAuth } from '@/contexts/AuthContext';

type UserItem = {
  id: string;
  email: string;
  name: string | null;
  roles: string[];
  created_at: string;
};

export default function ManageMembersPage() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string; action: string } | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: users, isLoading, refetch } = trpc.admin.getAllUsers.useQuery();
  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: currentUserRoles } = trpc.user.roles.useQuery();
  const isSuperAdmin = currentUserRoles?.includes('super_admin') || false;

  // @ts-expect-error - trpc router types may not be fully synced yet
  const promoteToAdminMutation = trpc.admin.promoteToAdmin.useMutation({
    onSuccess: () => {
      setConfirmDialogOpen(false);
      setSelectedUser(null);
      refetch();
    },
  });

  // @ts-expect-error - trpc router types may not be fully synced yet
  const removeAdminMutation = trpc.admin.removeAdminRole.useMutation({
    onSuccess: () => {
      setConfirmDialogOpen(false);
      setSelectedUser(null);
      refetch();
    },
  });

  // @ts-expect-error - trpc router types may not be fully synced yet
  const assignSuperAdminMutation = trpc.admin.assignSuperAdmin.useMutation({
    onSuccess: () => {
      setConfirmDialogOpen(false);
      setSelectedUser(null);
      refetch();
    },
  });

  // @ts-expect-error - trpc router types may not be fully synced yet
  const removeSuperAdminMutation = trpc.admin.removeSuperAdmin.useMutation({
    onSuccess: () => {
      setConfirmDialogOpen(false);
      setSelectedUser(null);
      refetch();
    },
  });

  const handleAction = (userId: string, userEmail: string, action: string) => {
    setSelectedUser({ id: userId, email: userEmail, action });
    setConfirmDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedUser) return;

    try {
      switch (selectedUser.action) {
        case 'promote-admin':
          await promoteToAdminMutation.mutateAsync({ userId: selectedUser.id });
          break;
        case 'remove-admin':
          await removeAdminMutation.mutateAsync({ userId: selectedUser.id });
          break;
        case 'assign-super-admin':
          await assignSuperAdminMutation.mutateAsync({ userId: selectedUser.id });
          break;
        case 'remove-super-admin':
          await removeSuperAdminMutation.mutateAsync({ userId: selectedUser.id });
          break;
      }
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'promote-admin':
        return 'Promote to Admin';
      case 'remove-admin':
        return 'Remove Admin Role';
      case 'assign-super-admin':
        return 'Assign Super Admin';
      case 'remove-super-admin':
        return 'Remove Super Admin';
      default:
        return '';
    }
  };

  const getActionMessage = (action: string, email: string) => {
    switch (action) {
      case 'promote-admin':
        return `Are you sure you want to promote ${email} to admin? They will be able to review deals and manage members.`;
      case 'remove-admin':
        return `Are you sure you want to remove admin role from ${email}? They will lose admin privileges.`;
      case 'assign-super-admin':
        return `Are you sure you want to assign super admin role to ${email}? They will have full platform control including the ability to remove admin roles.`;
      case 'remove-super-admin':
        return `Are you sure you want to remove super admin role from ${email}? They will lose super admin privileges.`;
      default:
        return '';
    }
  };

  if (isLoading) {
    return <SectionLoader />;
  }

  return (
    <Container
      maxWidth={1200}
      style={{
        padding: `clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']}) clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']})`,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Heading level={1} variant="title1" style={{ marginBottom: '2rem' }}>
        Manage Members
      </Heading>

      {promoteToAdminMutation.isError && (
        <Alert variant="error" message={promoteToAdminMutation.error?.message || 'Failed to promote user'} className="mb-6" />
      )}
      {removeAdminMutation.isError && (
        <Alert variant="error" message={removeAdminMutation.error?.message || 'Failed to remove admin role'} className="mb-6" />
      )}
      {assignSuperAdminMutation.isError && (
        <Alert variant="error" message={assignSuperAdminMutation.error?.message || 'Failed to assign super admin'} className="mb-6" />
      )}
      {removeSuperAdminMutation.isError && (
        <Alert variant="error" message={removeSuperAdminMutation.error?.message || 'Failed to remove super admin'} className="mb-6" />
      )}

      {!users || users.length === 0 ? (
        <Card variant="elevated" className="p-8 text-center">
          <Heading level={2} variant="headline" style={{ color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
            No members found
          </Heading>
          <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
            There are no users in the system yet.
          </Text>
        </Card>
      ) : (
        <Card variant="elevated">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600 }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600 }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600 }}>Roles</th>
                  <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600 }}>Created</th>
                  <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem: UserItem) => {
                  const hasAdmin = userItem.roles.includes('admin');
                  const hasSuperAdmin = userItem.roles.includes('super_admin');
                  const isCurrentUser = user?.id === userItem.id;

                  return (
                    <tr key={userItem.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem' }}>
                        <Text variant="body">{userItem.email}</Text>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <Text variant="body">{userItem.name || '—'}</Text>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {userItem.roles.length === 0 ? (
                            <Badge variant="default" size="sm">user</Badge>
                          ) : (
                            userItem.roles.map((role: string) => (
                              <Badge
                                key={role}
                                variant={role === 'super_admin' ? 'error' : role === 'admin' ? 'warning' : 'default'}
                                size="sm"
                              >
                                {role}
                              </Badge>
                            ))
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
                          {userItem.created_at
                            ? new Date(userItem.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                            : '—'}
                        </Text>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          {!hasAdmin && (
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => handleAction(userItem.id, userItem.email, 'promote-admin')}
                              loading={promoteToAdminMutation.isLoading}
                              disabled={promoteToAdminMutation.isLoading}
                            >
                              <PersonAddIcon style={{ fontSize: '18px' }} />
                              Promote to Admin
                            </Button>
                          )}
                          {hasAdmin && isSuperAdmin && !isCurrentUser && (
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => handleAction(userItem.id, userItem.email, 'remove-admin')}
                              loading={removeAdminMutation.isLoading}
                              disabled={removeAdminMutation.isLoading || hasSuperAdmin}
                            >
                              <PersonRemoveIcon style={{ fontSize: '18px' }} />
                              Remove Admin
                            </Button>
                          )}
                          {!hasSuperAdmin && isSuperAdmin && (
                            <Button
                              variant="primary"
                              size="small"
                              onClick={() => handleAction(userItem.id, userItem.email, 'assign-super-admin')}
                              loading={assignSuperAdminMutation.isLoading}
                              disabled={assignSuperAdminMutation.isLoading}
                            >
                              <ShieldIcon style={{ fontSize: '18px' }} />
                              Assign Super Admin
                            </Button>
                          )}
                          {hasSuperAdmin && isSuperAdmin && !isCurrentUser && (
                            <Button
                              variant="destructive"
                              size="small"
                              onClick={() => handleAction(userItem.id, userItem.email, 'remove-super-admin')}
                              loading={removeSuperAdminMutation.isLoading}
                              disabled={removeSuperAdminMutation.isLoading}
                            >
                              <ShieldOutlinedIcon style={{ fontSize: '18px' }} />
                              Remove Super Admin
                            </Button>
                          )}
                          {isCurrentUser && (
                            <Text variant="caption1" style={{ color: 'var(--muted-foreground)', fontStyle: 'italic' }}>
                              (You)
                            </Text>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Confirmation Modal */}
      <Modal
        open={confirmDialogOpen}
        onClose={() => {
          setConfirmDialogOpen(false);
          setSelectedUser(null);
        }}
        title={selectedUser ? getActionLabel(selectedUser.action) : 'Confirm Action'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {selectedUser && (
            <>
              <Alert
                variant={selectedUser.action.includes('remove') ? 'warning' : 'info'}
                message={getActionMessage(selectedUser.action, selectedUser.email)}
              />
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setConfirmDialogOpen(false);
                    setSelectedUser(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant={selectedUser.action.includes('remove') ? 'destructive' : 'primary'}
                  onClick={confirmAction}
                  loading={
                    promoteToAdminMutation.isLoading ||
                    removeAdminMutation.isLoading ||
                    assignSuperAdminMutation.isLoading ||
                    removeSuperAdminMutation.isLoading
                  }
                  disabled={
                    promoteToAdminMutation.isLoading ||
                    removeAdminMutation.isLoading ||
                    assignSuperAdminMutation.isLoading ||
                    removeSuperAdminMutation.isLoading
                  }
                >
                  Confirm
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </Container>
  );
}
