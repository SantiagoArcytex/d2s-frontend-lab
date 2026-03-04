'use client';

import React from 'react';
import { Container, Heading, Text, Card } from '@/design-system';
import Link from 'next/link';

// Client-only component to avoid hydration mismatch
function LastUpdatedDate() {
  return (
    <span suppressHydrationWarning>
      {new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </span>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        padding: 'clamp(2rem, 4rem, 4rem) 1rem',
      }}
    >
      <Container maxWidth={900}>
        <div style={{ marginBottom: '2rem' }}>
          <Link
            href="/"
            style={{
              color: 'var(--primary)',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            ← Back to Home
          </Link>
        </div>

        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header */}
            <div>
              <Heading level={1} variant="title1" style={{ marginBottom: '0.5rem' }}>
                Privacy Policy
              </Heading>
              <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
                Last updated: <LastUpdatedDate />
              </Text>
            </div>

            {/* Introduction */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                1. Introduction
              </Heading>
              <Text variant="body" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                At DeathToSaaS, we are committed to protecting your privacy. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our Service.
              </Text>
              <Text variant="body" style={{ lineHeight: 1.6 }}>
                Please read this Privacy Policy carefully. By using our Service, you consent to the data practices described
                in this policy.
              </Text>
            </section>

            {/* Information We Collect */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                2. Information We Collect
              </Heading>

              <Heading level={3} variant="headline" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                2.1 Information You Provide
              </Heading>
              <Text variant="body" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                We collect information that you provide directly to us, including:
              </Text>
              <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem', lineHeight: 1.8 }}>
                <li>Account information (name, email address, password)</li>
                <li>Profile information and preferences</li>
                <li>Content you create or upload to the Service</li>
                <li>Communications with us (support requests, feedback)</li>
                <li>Payment information (processed securely through third-party providers)</li>
              </ul>

              <Heading level={3} variant="headline" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                2.2 Automatically Collected Information
              </Heading>
              <Text variant="body" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                We automatically collect certain information when you use our Service:
              </Text>
              <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem', lineHeight: 1.8 }}>
                <li>Device information (device type, operating system, browser)</li>
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Log data (IP address, access times, error logs)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                3. How We Use Your Information
              </Heading>
              <Text variant="body" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                We use the information we collect to:
              </Text>
              <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem', lineHeight: 1.8 }}>
                <li>Provide, maintain, and improve our Service</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze usage patterns and trends</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Personalize your experience</li>
                <li>Send you marketing communications (with your consent)</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                4. Information Sharing and Disclosure
              </Heading>
              <Text variant="body" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                We do not sell your personal information. We may share your information in the following circumstances:
              </Text>
              <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem', lineHeight: 1.8 }}>
                <li>
                  <strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (payment
                  processing, analytics, hosting)
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets
                </li>
                <li>
                  <strong>With Your Consent:</strong> When you explicitly authorize us to share your information
                </li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                5. Data Security
              </Heading>
              <Text variant="body" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                We implement appropriate technical and organizational security measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </Text>
              <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem', lineHeight: 1.8 }}>
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication</li>
                <li>Secure data storage and backup procedures</li>
              </ul>
              <Text variant="body" style={{ lineHeight: 1.6 }}>
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive
                to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
              </Text>
            </section>

            {/* Your Rights */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                6. Your Rights and Choices
              </Heading>
              <Text variant="body" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                Depending on your location, you may have certain rights regarding your personal information:
              </Text>
              <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem', lineHeight: 1.8 }}>
                <li>
                  <strong>Access:</strong> Request access to your personal information
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal information
                </li>
                <li>
                  <strong>Portability:</strong> Request transfer of your data to another service
                </li>
                <li>
                  <strong>Opt-out:</strong> Unsubscribe from marketing communications
                </li>
                <li>
                  <strong>Cookies:</strong> Manage cookie preferences through your browser settings
                </li>
              </ul>
              <Text variant="body" style={{ lineHeight: 1.6 }}>
                To exercise these rights, please contact us using the information provided in the &quot;Contact Us&quot; section.
              </Text>
            </section>

            {/* Cookies */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                7. Cookies and Tracking Technologies
              </Heading>
              <Text variant="body" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                We use cookies and similar tracking technologies to track activity on our Service and store certain
                information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </Text>
              <Text variant="body" style={{ lineHeight: 1.6 }}>
                However, if you do not accept cookies, you may not be able to use some portions of our Service.
              </Text>
            </section>

            {/* Children's Privacy */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                8. Children&apos;s Privacy
              </Heading>
              <Text variant="body" style={{ lineHeight: 1.6 }}>
                Our Service is not intended for children under the age of 13. We do not knowingly collect personal
                information from children under 13. If you are a parent or guardian and believe your child has provided us
                with personal information, please contact us immediately.
              </Text>
            </section>

            {/* International Transfers */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                9. International Data Transfers
              </Heading>
              <Text variant="body" style={{ lineHeight: 1.6 }}>
                Your information may be transferred to and maintained on computers located outside of your state, province,
                country, or other governmental jurisdiction where data protection laws may differ. By using our Service, you
                consent to the transfer of your information to these facilities.
              </Text>
            </section>

            {/* Changes to Policy */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                10. Changes to This Privacy Policy
              </Heading>
              <Text variant="body" style={{ lineHeight: 1.6 }}>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are advised to review this Privacy
                Policy periodically for any changes.
              </Text>
            </section>

            {/* Contact Information */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                11. Contact Us
              </Heading>
              <Text variant="body" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </Text>
              <Text variant="body" style={{ marginTop: '0.5rem', lineHeight: 1.6 }}>
                Email: privacy@deathtosaas.com
                <br />
                Address: [Your Business Address]
              </Text>
            </section>

            {/* Footer */}
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              <Text variant="caption1" style={{ color: 'var(--text-muted)' }}>
                By using our Service, you acknowledge that you have read and understood this Privacy Policy.
              </Text>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}
