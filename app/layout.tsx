import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppThemeProvider } from "@/lib/theme/theme";
import { TRPCProvider } from "@/lib/trpc/provider";
import { inter, manrope, spaceGrotesk, jetbrainsMono } from "@/lib/theme/mui-theme";
import { PageTransition } from "@/components/layout/PageTransition";
import { MotionScrollProvider } from "@/components/layout/MotionScrollProvider";
import { WebVitals } from "@/components/analytics/WebVitals";
import Script from "next/script";
import { Navbar } from "@/components/ds/Navbar";
import { NavbarProvider } from "@/contexts/NavbarContext";

export const metadata: Metadata = {
  title: "Vibe Coding Incubator (VCI) — Deal Marketplace",
  description: "Curated marketplace of production-ready apps from vetted creators. Own your apps, own your data.",
  manifest: "/manifest.json",
  icons: {
    icon: "/Type=Primary.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VCI",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#3C83F5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VCI" />
        {/* iOS Splash Screens */}
        <link rel="apple-touch-startup-image" href="/icons/splash-iphone-se.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/icons/splash-iphone-6-7-8.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/icons/splash-iphone-6-7-8-plus.png" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/icons/splash-iphone-x.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/icons/splash-ipad.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/icons/splash-ipad-pro.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" />
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AppThemeProvider>
          <TRPCProvider>
            <AuthProvider>
              <NavbarProvider>
                <Navbar />
                <main>
                  <MotionScrollProvider>
                    <PageTransition>
                      {children}
                    </PageTransition>
                  </MotionScrollProvider>
                </main>
              </NavbarProvider>
            </AuthProvider>
          </TRPCProvider>
        </AppThemeProvider>
        <WebVitals />
        <Script
          id="register-service-worker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('Service Worker registered:', registration);
                    })
                    .catch((error) => {
                      console.error('Service Worker registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
