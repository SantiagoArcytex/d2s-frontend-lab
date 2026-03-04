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

export default function TermsOfServicePage() {
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
                Terms of Service
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
                Welcome to DeathToSaaS. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our platform,
                services, and applications (collectively, the &quot;Service&quot;). By accessing or using our Service, you agree to
                be bound by these Terms.
              </Text>
              <Text variant="body" style={{ lineHeight: 1.6 }}>
                If you do not agree to these Terms, please do not use our Service. We reserve the right to modify these
                Terms at any time, and such modifications will be effective immediately upon posting.
              </Text>
            </section>

            {/* Acceptance of Terms */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                2. Acceptance of Terms
              </Heading>
              <Text variant="body" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                By creating an account, accessing, or using our Service, you acknowledge that you have read, understood, and
                agree to be bound by these Terms and our Privacy Policy.
              </Text>
            </section>

            {/* User Accounts */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                3. User Accounts
              </Heading>
              <Text variant="body" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities
                that occur under your account. You agree to:
              </Text>
              <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem', lineHeight: 1.8 }}>
                <li>Provide accurate, current, and complete information when creating an account</li>
                <li>Maintain and promptly update your account information</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            {/* Use of Service */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                4. Use of Service
              </Heading>
              <Text variant="body" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree not to:
              </Text>
              <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem', lineHeight: 1.8 }}>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit any malicious code, viruses, or harmful data</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use the Service for any illegal or unauthorized purpose</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                5. Intellectual Property
              </Heading>
              <Text variant="body" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                The Service and its original content, features, and functionality are owned by DeathToSaaS and are protected
                by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </Text>
              <Text variant="body" style={{ lineHeight: 1.6 }}>
                You retain ownership of any content you create or upload to the Service. By using the Service, you grant us
                a license to use, store, and process your content as necessary to provide the Service.
              </Text>
            </section>

            {/* Payment Terms */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                6. Payment Terms
              </Heading>
              <Text variant="body" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                If you purchase a subscription or paid service:
              </Text>
              <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem', lineHeight: 1.8 }}>
                <li>You agree to pay all fees associated with your subscription</li>
                <li>Fees are billed in advance on a recurring basis</li>
                <li>All fees are non-refundable unless otherwise stated</li>
                <li>We reserve the right to change our pricing with 30 days notice</li>
                <li>You may cancel your subscription at any time</li>
              </ul>
            </section>

            {/* Termination */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                7. Termination
              </Heading>
              <Text variant="body" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for
                conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </Text>
              <Text variant="body" style={{ lineHeight: 1.6 }}>
                You may terminate your account at any time by contacting us or using the account deletion feature in your
                settings.
              </Text>
            </section>

            {/* Disclaimer of Warranties */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                8. Disclaimer of Warranties
              </Heading>
              <Text variant="body" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,
                INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
                NON-INFRINGEMENT.
              </Text>
            </section>

            {/* Limitation of Liability */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                9. Limitation of Liability
              </Heading>
              <Text variant="body" style={{ lineHeight: 1.6 }}>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, DEATHTOSAAS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR
                INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </Text>
            </section>

            {/* Governing Law */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                10. Governing Law
              </Heading>
              <Text variant="body" style={{ lineHeight: 1.6 }}>
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without
                regard to its conflict of law provisions.
              </Text>
            </section>

            {/* Contact Information */}
            <section>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                11. Contact Us
              </Heading>
              <Text variant="body" style={{ lineHeight: 1.6 }}>
                If you have any questions about these Terms, please contact us at:
              </Text>
              <Text variant="body" style={{ marginTop: '0.5rem', lineHeight: 1.6 }}>
                Email: legal@deathtosaas.com
                <br />
                Address: [Your Business Address]
              </Text>
            </section>

            {/* Footer */}
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              <Text variant="caption1" style={{ color: 'var(--text-muted)' }}>
                By using our Service, you acknowledge that you have read and understood these Terms of Service.
              </Text>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}
