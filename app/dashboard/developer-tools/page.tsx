'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Heading, Text, Container, Card, Button, Badge, Alert, Modal, Divider, IconButton } from '@/design-system';
import { designTokens } from '@/lib/theme/tokens';
import { TextField } from '@/components/forms/TextField';
import { ContentCopy as ContentCopyIcon, Check as CheckIcon, HelpOutline as HelpOutlineIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { trpc } from '@/lib/trpc/client';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';

// Lazy load syntax highlighter with style (heavy component, client-only)
const SyntaxHighlighter = dynamic(
  () =>
    Promise.all([
      import('react-syntax-highlighter').then(mod => mod.Prism),
      import('react-syntax-highlighter/dist/esm/styles/prism').then(mod => mod.vscDarkPlus)
    ]).then(([Prism, style]) => {
      // Create a wrapper component that includes the style
      const HighlighterWrapper = (props: React.ComponentProps<typeof Prism>) => <Prism style={style} {...props} />;
      HighlighterWrapper.displayName = 'SyntaxHighlighterWrapper';
      return HighlighterWrapper;
    }),
  {
    ssr: false,
    loading: () => <div style={{ padding: '1rem' }}>Loading code...</div>
  }
);

type EmbedTokenResult = {
  token: string;
  expiresIn?: number;
};

type CreateFormState = {
  appId: string;
  name: string;
  description: string;
  allowedOrigins: string;
  embedTokenTtlSeconds: number;
  mode: 'basic' | 'advanced';
  pwaUrl: string;
};

const initialForm: CreateFormState = {
  appId: '',
  name: '',
  description: '',
  allowedOrigins: '',
  embedTokenTtlSeconds: 600,
  mode: 'basic',
  pwaUrl: '',
};

const normalizeOrigins = (value: string) =>
  value
    .split(/[\n,]/)
    .map((o: string) => o.trim())
    .filter(Boolean);

const toOrigin = (url: string) => {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return null;
  }
};

function DeveloperAppCard({
  app,
  onIssueToken,
  onRotate,
  issuing,
  rotating,
  issueError,
  issuedToken,
}: {
  app: { app_id: string; name: string; description?: string; status: string; app?: { name: string; subdomain: string }; allowed_origins?: string[]; embed_public_key: string };
  onIssueToken: (origin: string) => void;
  onRotate: () => void;
  issuing: boolean;
  rotating: boolean;
  issueError?: string | null;
  issuedToken?: EmbedTokenResult | null;
}) {
  const [originInput, setOriginInput] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [showSnippetToken, setShowSnippetToken] = useState(false);
  const [appIdCopied, setAppIdCopied] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [snippetCopied, setSnippetCopied] = useState(false);

  const handleCopyAppId = async () => {
    try {
      await navigator.clipboard.writeText(app.app_id);
      setAppIdCopied(true);
      setTimeout(() => setAppIdCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy AppID:', err);
    }
  };

  const handleCopyToken = async () => {
    if (!issuedToken?.token) return;
    try {
      await navigator.clipboard.writeText(issuedToken.token);
      setTokenCopied(true);
      setTimeout(() => setTokenCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy token:', err);
    }
  };

  const embedConfigSnippet = `const appId = '${app.app_id}';
const embedToken = '${issuedToken?.token || '<ISSUE_TOKEN_FIRST>'}'`;

  const embedConfigSnippetRedacted = `const appId = '${app.app_id}';
const embedToken = '${issuedToken?.token ? '••••••••••••••••' : '<ISSUE_TOKEN_FIRST>'}'`;

  const handleCopySnippet = async () => {
    const snippetToCopy = showSnippetToken && issuedToken?.token
      ? embedConfigSnippet
      : embedConfigSnippetRedacted;
    try {
      await navigator.clipboard.writeText(snippetToCopy);
      setSnippetCopied(true);
      setTimeout(() => setSnippetCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy snippet:', err);
    }
  };

  return (
    <Card variant="outlined">
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <Heading level={3} variant="headline" style={{ marginBottom: '0.25rem' }}>
              {app.name}
            </Heading>
            <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
              {app.description || 'No description provided'}
            </Text>
          </div>
          <Badge variant={app.status === 'active' ? 'success' : 'warning'} size="sm">
            {app.status}
          </Badge>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <Text variant="caption1" weight="semibold" style={{ display: 'block', marginBottom: '0.25rem' }}>
              Linked app
            </Text>
            <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
              {app.app?.name} · {app.app?.subdomain}
            </Text>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <Text variant="caption1" weight="semibold">App ID</Text>
              <IconButton
                icon={appIdCopied ? <CheckIcon style={{ fontSize: '18px', color: 'var(--success)' }} /> : <ContentCopyIcon style={{ fontSize: '18px' }} />}
                onClick={handleCopyAppId}
                size="small"
                aria-label={appIdCopied ? 'Copied!' : 'Copy App ID'}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <TextField
                value={app.app_id}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                }}
              />
              <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                <IconButton
                  icon={appIdCopied ? <CheckIcon style={{ fontSize: '18px', color: 'var(--success)' }} /> : <ContentCopyIcon style={{ fontSize: '18px' }} />}
                  onClick={handleCopyAppId}
                  size="small"
                  aria-label={appIdCopied ? 'Copied!' : 'Copy App ID'}
                />
              </div>
            </div>
            <Text variant="caption1" style={{ color: 'var(--muted-foreground)', marginTop: '0.25rem', display: 'block' }}>
              Use this App ID in your embed configuration
            </Text>
          </div>

          <div>
            <Text variant="caption1" weight="semibold" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Allowed origins
            </Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {app.allowed_origins?.length ? (
                app.allowed_origins.map((origin: string) => (
                  <Badge key={origin} variant="default" size="sm">{origin}</Badge>
                ))
              ) : (
                <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
                  None configured
                </Text>
              )}
            </div>
          </div>

          <div>
            <Text variant="caption1" weight="semibold" style={{ display: 'block', marginBottom: '0.25rem' }}>
              Embed public key
            </Text>
            <Text variant="body" style={{ color: 'var(--muted-foreground)', wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {app.embed_public_key}
            </Text>
          </div>

          <div>
            <Text variant="caption1" weight="semibold" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Issue embed token
            </Text>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <TextField
                label="Origin (must be allowed)"
                value={originInput}
                onChange={(e) => setOriginInput(e.target.value)}
                fullWidth
                style={{ flex: 1, minWidth: '200px' }}
              />
              <Button
                variant="primary"
                onClick={() => onIssueToken(originInput)}
                loading={issuing}
                disabled={!originInput}
              >
                Issue token
              </Button>
            </div>
            {issueError ? (
              <Alert variant="error" message={issueError} className="mb-2" />
            ) : issuedToken ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <TextField
                    label="Embed token"
                    type={showToken ? 'text' : 'password'}
                    value={issuedToken.token}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                    }}
                  />
                  <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '0.25rem' }}>
                    <IconButton
                      icon={showToken ? <VisibilityOff style={{ fontSize: '18px' }} /> : <Visibility style={{ fontSize: '18px' }} />}
                      onClick={() => setShowToken(!showToken)}
                      size="small"
                      aria-label={showToken ? 'Hide token' : 'Show token'}
                    />
                    <IconButton
                      icon={tokenCopied ? <CheckIcon style={{ fontSize: '18px', color: 'var(--success)' }} /> : <ContentCopyIcon style={{ fontSize: '18px' }} />}
                      onClick={handleCopyToken}
                      size="small"
                      aria-label={tokenCopied ? 'Copied!' : 'Copy token'}
                    />
                  </div>
                </div>
                {issuedToken.expiresIn && (
                  <Text variant="caption1" style={{ color: 'var(--muted-foreground)' }}>
                    Expires in {issuedToken.expiresIn} seconds
                  </Text>
                )}
              </div>
            ) : null}
          </div>

          {issuedToken && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <Text variant="caption1" weight="semibold">Embed Configuration</Text>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {issuedToken?.token && (
                    <IconButton
                      icon={showSnippetToken ? <VisibilityOff style={{ fontSize: '18px' }} /> : <Visibility style={{ fontSize: '18px' }} />}
                      onClick={() => setShowSnippetToken(!showSnippetToken)}
                      size="small"
                      aria-label={showSnippetToken ? 'Hide token in snippet' : 'Show token in snippet'}
                    />
                  )}
                  <IconButton
                    icon={snippetCopied ? <CheckIcon style={{ fontSize: '18px', color: 'var(--success)' }} /> : <ContentCopyIcon style={{ fontSize: '18px' }} />}
                    onClick={handleCopySnippet}
                    size="small"
                    aria-label={snippetCopied ? 'Copied!' : 'Copy code snippet'}
                  />
                </div>
              </div>
              <TextField
                multiline
                rows={2}
                value={showSnippetToken && issuedToken?.token ? embedConfigSnippet : embedConfigSnippetRedacted}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                }}
              />
              <Text variant="caption1" style={{ color: 'var(--muted-foreground)', marginTop: '0.25rem', display: 'block' }}>
                Ready-to-use code snippet. Copy and paste into your PWA integration code.
              </Text>
            </div>
          )}

          <Divider />

          <Button variant="outline" onClick={onRotate} loading={rotating} disabled={rotating}>
            Rotate secrets
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function DeveloperToolsPage() {
  const [form, setForm] = useState<CreateFormState>(initialForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [issueStates, setIssueStates] = useState<Record<string, EmbedTokenResult | null>>({});
  const [issueErrors, setIssueErrors] = useState<Record<string, string | null>>({});
  const [copied, setCopied] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [exampleCopied, setExampleCopied] = useState(false);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [supportFormError, setSupportFormError] = useState<string | null>(null);
  const [supportFormSubmitting, setSupportFormSubmitting] = useState(false);

  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: apps } = trpc.app.list.useQuery();
  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: developerApps, refetch, isLoading, error } = trpc.developerApp.list.useQuery();

  // @ts-expect-error - trpc router types may not be fully synced yet
  const createMutation = trpc.developerApp.create.useMutation({
    onSuccess: () => {
      setForm(initialForm);
      refetch();
    },
    onError: (err: Error) => setFormError(err.message),
  });

  // @ts-expect-error - trpc router types may not be fully synced yet
  const issueMutation = trpc.developerApp.issueEmbedToken.useMutation();
  // @ts-expect-error - trpc router types may not be fully synced yet
  const rotateMutation = trpc.developerApp.rotateSecrets.useMutation({
    onSuccess: () => refetch(),
  });

  const appOptions = useMemo(() => apps || [], [apps]);

  const deriveOrigins = () => {
    const dashboardOrigin =
      typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.host}`
        : '';

    if (form.mode === 'basic') {
      const derived: string[] = [];
      if (dashboardOrigin) derived.push(dashboardOrigin);
      const pwaOrigin = toOrigin(form.pwaUrl.trim());
      if (pwaOrigin) derived.push(pwaOrigin);
      return Array.from(new Set(derived)).filter(Boolean);
    }

    return normalizeOrigins(form.allowedOrigins);
  };

  const handleCreate = () => {
    setFormError(null);
    const origins = deriveOrigins();
    if (!form.appId || !form.name || !origins.length) {
      setFormError('App, name, and at least one origin are required.');
      return;
    }

    createMutation.mutate({
      appId: form.appId,
      name: form.name,
      description: form.description,
      allowedOrigins: origins,
      embedTokenTtlSeconds: form.embedTokenTtlSeconds,
    });
  };

  const handleIssueToken = async (developerAppId: string, origin: string) => {
    setIssueErrors((prev) => ({ ...prev, [developerAppId]: null }));
    setIssueStates((prev) => ({ ...prev, [developerAppId]: null }));
    try {
      const result = await issueMutation.mutateAsync({
        developerAppId,
        origin,
      });
      setIssueStates((prev) => ({ ...prev, [developerAppId]: result }));
    } catch (err: unknown) {
      setIssueErrors((prev) => ({ ...prev, [developerAppId]: err instanceof Error ? err.message : 'Failed to issue token' }));
    }
  };

  const handleRotate = async (developerAppId: string) => {
    await rotateMutation.mutateAsync({ id: developerAppId });
  };

  const embedSnippet = `<script src="https://your-marketplace.com/embed-sdk.js"></script>
<script>
  const appId = '<APP_ID>';
  const embedToken = '<EMBED_TOKEN>'; // Issued for this origin
  
  async function loginToMarketplace() {
    try {
      const result = await window.MarketplaceEmbed.authenticate({
        appId,
        embedToken,
        baseUrl: 'https://your-marketplace.com'
      });
      // result.token is the short-lived JWT for your PWA
      // Use this token to authenticate API requests
      console.log('Authenticated:', result);
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  }
</script>`;

  const aiPrompt = `Add marketplace authentication to my PWA login page. Include the embed SDK script tag, create a loginToMarketplace() async function that calls window.MarketplaceEmbed.authenticate() with appId, embedToken, and baseUrl. Handle success (store the JWT token) and errors (show user-friendly message). Add a "Sign in with Marketplace" button that calls this function on click. Use the following code structure:`;

  const nextStepsAiPrompt = `After successful marketplace authentication, handle the result.token properly: Store it securely (localStorage/sessionStorage), treat it as successful authentication allowing full app access, include it in API requests as Bearer token in Authorization header, handle token expiration by re-authenticating when needed, and update app state to set user as authenticated and redirect to dashboard/home. Use the enhanced authentication handler pattern shown in the example code.`;

  const exampleCode = `async function loginToMarketplace() {
  try {
    const result = await window.MarketplaceEmbed.authenticate({
      appId,
      embedToken,
      baseUrl: 'https://your-marketplace.com'
    });
    
    // Store token securely
    localStorage.setItem('marketplace_token', result.token);
    
    // Update app state - user is now authenticated
    setUserAuthenticated(true);
    
    // Redirect to app dashboard/home
    window.location.href = '/dashboard/home';
    
  } catch (error) {
    // Handle errors gracefully
    showErrorMessage('Authentication failed. Please try again.');
  }
}`;

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(embedSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(aiPrompt);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyExample = async () => {
    try {
      await navigator.clipboard.writeText(exampleCode);
      setExampleCopied(true);
      setTimeout(() => setExampleCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // unused handleCopyNextStepsPrompt 

  const handleSupportDialogOpen = () => {
    setSupportDialogOpen(true);
  };

  const handleSupportDialogClose = () => {
    setSupportDialogOpen(false);
    setSupportForm({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    setSupportFormError(null);
  };

  const handleSupportFormSubmit = async () => {
    setSupportFormError(null);

    if (!supportForm.name || !supportForm.email || !supportForm.message) {
      setSupportFormError('Please fill in all required fields.');
      return;
    }

    setSupportFormSubmitting(true);
    try {
      // TODO: Implement actual support form submission (email API, webhook, etc.)
      // For now, just log and show success
      console.log('Support form submitted:', supportForm);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success and close
      handleSupportDialogClose();
      // You could show a success toast here
    } catch (err: unknown) {
      setSupportFormError(err instanceof Error ? err.message : 'Failed to submit support request. Please try again.');
    } finally {
      setSupportFormSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Container
        maxWidth={1200}
        style={{
          padding: `clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']}) clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']})`,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <Heading level={1} variant="title1" style={{ marginBottom: '0.5rem' }}>
              Developer Tools
            </Heading>
            <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
              Register developer apps, manage allowed origins, and generate embed tokens for your PWA embeds.
            </Text>
          </div>

          <Card variant="outlined">
            <div style={{ padding: '1.5rem' }}>
              <Heading level={2} variant="headline" style={{ marginBottom: '1.5rem' }}>
                Create developer app
              </Heading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
                    Existing app
                  </label>
                  <select
                    value={form.appId}
                    onChange={(e) => setForm((prev) => ({ ...prev, appId: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--card)',
                      color: 'var(--foreground)',
                      fontSize: '15px',
                      minHeight: '44px',
                    }}
                  >
                    <option value="">Select an app</option>
                    {appOptions.map((app: { id: string; name: string; subdomain: string }) => (
                      <option key={app.id} value={app.id}>
                        {app.name} ({app.subdomain})
                      </option>
                    ))}
                  </select>
                  <Text variant="caption1" style={{ color: 'var(--muted-foreground)', marginTop: '0.25rem', display: 'block' }}>
                    Tenant-owned app this embed will authenticate against.
                  </Text>
                </div>

                <TextField
                  label="Developer app name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  fullWidth
                  helperText="Internal label shown only to you."
                />

                <TextField
                  label="Description"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  multiline
                  rows={2}
                  fullWidth
                  helperText="Optional notes about this embed integration."
                />

                <div>
                  <Text variant="caption1" weight="semibold" style={{ display: 'block', marginBottom: '0.75rem' }}>
                    Configuration mode
                  </Text>
                  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        value="basic"
                        checked={form.mode === 'basic'}
                        onChange={(e) => setForm((prev) => ({ ...prev, mode: e.target.value as CreateFormState['mode'] }))}
                        style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                      />
                      <Text variant="body">Basic</Text>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        value="advanced"
                        checked={form.mode === 'advanced'}
                        onChange={(e) => setForm((prev) => ({ ...prev, mode: e.target.value as CreateFormState['mode'] }))}
                        style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                      />
                      <Text variant="body">Advanced</Text>
                    </label>
                  </div>
                  <Text variant="caption1" style={{ color: 'var(--muted-foreground)' }}>
                    {form.mode === 'basic'
                      ? 'We automatically include your dashboard origin. Optionally add your PWA URL.'
                      : 'Manually specify allowed origins for full control.'}
                  </Text>
                </div>

                {form.mode === 'basic' ? (
                  <>
                    <TextField
                      label="PWA URL (optional)"
                      value={form.pwaUrl}
                      onChange={(e) => setForm((prev) => ({ ...prev, pwaUrl: e.target.value }))}
                      placeholder="https://my-pwa.com"
                      fullWidth
                      helperText="We derive the origin from this URL. Dashboard origin is always included."
                    />
                    <div>
                      <Text variant="caption1" weight="semibold" style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Derived allowed origins
                      </Text>
                      <div
                        style={{
                          backgroundColor: 'var(--popover)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          padding: '1rem',
                          minHeight: '60px',
                        }}
                      >
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {deriveOrigins().length > 0 ? (
                            deriveOrigins().map((o: string) => (
                              <Badge key={o} variant="default" size="sm">{o}</Badge>
                            ))
                          ) : (
                            <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
                              Dashboard origin will be included automatically. Add a PWA URL to include it as well.
                            </Text>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <TextField
                    label="Allowed origins"
                    value={form.allowedOrigins}
                    onChange={(e) => setForm((prev) => ({ ...prev, allowedOrigins: e.target.value }))}
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="https://example.com&#10;https://staging.example.com"
                    helperText="One origin per line or comma-separated. Must include protocol (https:// or http://)."
                  />
                )}

                <TextField
                  label="Embed token TTL (seconds)"
                  type="number"
                  value={form.embedTokenTtlSeconds}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      embedTokenTtlSeconds: Number(e.target.value) > 0 ? Number(e.target.value) : 600,
                    }))
                  }
                  inputProps={{ min: 60, step: 60 }}
                  fullWidth
                  helperText="Lifetime of issued embed tokens. Shorter is safer (default 600s = 10 minutes)."
                />

                {formError && <Alert variant="error" message={formError} />}

                <Button
                  variant="primary"
                  onClick={handleCreate}
                  loading={createMutation.isLoading}
                  fullWidth
                  size="large"
                >
                  Create developer app
                </Button>
              </div>
            </div>
          </Card>

          <Card variant="outlined">
            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <Heading level={2} variant="headline" style={{ marginBottom: '0.25rem' }}>
                  Embed snippet
                </Heading>
                <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
                  Copy this code to integrate marketplace authentication in your PWA
                </Text>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <Heading level={3} variant="headline" style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>
                    Quick start
                  </Heading>
                  <Alert variant="info" message="Add to your PWA's login page. Call loginToMarketplace() when user clicks 'Sign in with Marketplace'. Replace APP_ID and EMBED_TOKEN with values from above. Update baseUrl to match your marketplace domain." />
                </div>

                <div>
                  <div>
                    <Alert variant="success" message="Using an AI coding assistant or IDE? Copy the prompt below to help your assistant integrate this correctly." />
                    <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton
                        icon={promptCopied ? <CheckIcon style={{ fontSize: '18px', color: 'var(--success)' }} /> : <ContentCopyIcon style={{ fontSize: '18px' }} />}
                        onClick={handleCopyPrompt}
                        size="small"
                        aria-label={promptCopied ? 'Copied!' : 'Copy prompt to clipboard'}
                      />
                    </div>
                    <div
                      style={{
                        backgroundColor: 'var(--popover)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        marginTop: '0.5rem',
                      }}
                    >
                      <pre
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          margin: 0,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          lineHeight: 1.6,
                          color: 'var(--foreground)',
                        }}
                      >
                        {aiPrompt}
                      </pre>
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <Heading level={3} variant="headline" style={{ fontSize: '1.125rem' }}>
                      JavaScript code snippet
                    </Heading>
                    <IconButton
                      icon={copied ? <CheckIcon style={{ fontSize: '18px', color: 'var(--success)' }} /> : <ContentCopyIcon style={{ fontSize: '18px' }} />}
                      onClick={handleCopySnippet}
                      size="small"
                      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
                    />
                  </div>
                  <div
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <SyntaxHighlighter
                      language="javascript"
                      customStyle={{
                        margin: 0,
                        padding: '1.75rem',
                        backgroundColor: 'var(--popover)',
                        fontSize: '0.875rem',
                        lineHeight: 1.7,
                      }}
                    >
                      {embedSnippet}
                    </SyntaxHighlighter>
                  </div>
                </div>

                <Divider />

                <div>
                  <Heading level={3} variant="headline" style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>
                    Recommended next steps
                  </Heading>
                  <Alert variant="warning" message="Handle successful authentication: Store token securely, treat as successful auth, include in API requests as Bearer token, handle expiration." />
                  <div
                    style={{
                      backgroundColor: 'var(--popover)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      marginTop: '0.5rem',
                    }}
                  >
                    <pre
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        lineHeight: 1.6,
                        color: 'var(--foreground)',
                      }}
                    >
                      {nextStepsAiPrompt}
                    </pre>
                  </div>

                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <Text variant="body" weight="medium">
                        Example: Enhanced authentication handler
                      </Text>
                      <IconButton
                        icon={exampleCopied ? <CheckIcon style={{ fontSize: '18px', color: 'var(--success)' }} /> : <ContentCopyIcon style={{ fontSize: '18px' }} />}
                        onClick={handleCopyExample}
                        size="small"
                        aria-label={exampleCopied ? 'Copied!' : 'Copy to clipboard'}
                      />
                    </div>
                    <div
                      style={{
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      <SyntaxHighlighter
                        language="javascript"
                        customStyle={{
                          margin: 0,
                          padding: '1.5rem',
                          backgroundColor: 'var(--popover)',
                          fontSize: '0.875rem',
                          lineHeight: 1.7,
                        }}
                      >
                        {exampleCode}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>

                <Divider />

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="outline"
                    onClick={handleSupportDialogOpen}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <HelpOutlineIcon style={{ fontSize: '18px' }} />
                    Need Help?
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Modal
            open={supportDialogOpen}
            onClose={handleSupportDialogClose}
            title="Contact Support"
            variant="centered"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
                Need help with embedding? We&apos;re here to assist you.
              </Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <TextField
                  label="Your name"
                  value={supportForm.name}
                  onChange={(e) => setSupportForm((prev) => ({ ...prev, name: e.target.value }))}
                  fullWidth
                  required
                />
                <TextField
                  label="Email address"
                  type="email"
                  value={supportForm.email}
                  onChange={(e) => setSupportForm((prev) => ({ ...prev, email: e.target.value }))}
                  fullWidth
                  required
                  helperText="We'll use this to respond to your inquiry"
                />
                <TextField
                  label="Subject"
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm((prev) => ({ ...prev, subject: e.target.value }))}
                  fullWidth
                  placeholder="e.g., Integration help, Token issues, etc."
                />
                <TextField
                  label="Message"
                  value={supportForm.message}
                  onChange={(e) => setSupportForm((prev) => ({ ...prev, message: e.target.value }))}
                  multiline
                  rows={4}
                  fullWidth
                  required
                  placeholder="Describe your issue or question..."
                  helperText="Include details about your integration, error messages, or what you're trying to achieve"
                />
                {supportFormError && (
                  <Alert variant="error" message={supportFormError} />
                )}
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button onClick={handleSupportDialogClose} variant="outline">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSupportFormSubmit}
                  loading={supportFormSubmitting}
                  disabled={!supportForm.name || !supportForm.email || !supportForm.message}
                >
                  Send Message
                </Button>
              </div>
            </div>
          </Modal>

          <Divider />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Heading level={2} variant="headline">Existing developer apps</Heading>
            {isLoading && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}><LoadingSpinner size="medium" /><span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Loading...</span></div>}
            {error && <Alert variant="error" message={error.message} />}
            {!isLoading && developerApps && developerApps.length === 0 ? (
              <Alert variant="info" message="No developer apps yet. Create one to get started." />
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {developerApps?.map((devApp: { id: string; app_id: string; name: string; status: string; embed_public_key: string }) => (
                <DeveloperAppCard
                  key={devApp.id}
                  app={devApp}
                  issuing={issueMutation.isLoading}
                  rotating={rotateMutation.isLoading}
                  issuedToken={issueStates[devApp.id]}
                  issueError={issueErrors[devApp.id]}
                  onIssueToken={(origin) => handleIssueToken(devApp.id, origin)}
                  onRotate={() => handleRotate(devApp.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
