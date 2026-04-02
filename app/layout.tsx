import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Header } from '@/components/Header';
import ThemeProvider from '@/components/ThemeProvider';
import BugReportButton from '@/components/BugReportButton';
import Footer from '@/components/Footer';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Cadence - Veteran Transition Tool | Veteran-Founded & Disability-Informed',
  description: 'AI-powered military-to-civilian transition platform built by a service-disabled veteran. Personalized mission plans, VA benefits guidance, housing finder, and resources for every branch.',
  keywords: 'veteran transition, military to civilian, service-disabled veteran, VA benefits, transition assistance, ETS, separation, military retirement, veteran resources, disability claims, GI Bill, VA healthcare, veteran housing, transition planning',
  authors: [{ name: 'Service-Disabled Veteran Founder' }],
  creator: 'Cadence Veteran Transition Tool',
  publisher: 'Cadence',
  robots: 'index, follow',
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Cadence',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cadence.app',
    title: 'Cadence - Veteran Transition Tool | Veteran-Founded & Disability-Informed',
    description: 'AI-powered transition platform created by a service-disabled veteran. Personalized plans, VA benefits guidance, housing finder, and disability resources.',
    siteName: 'Cadence',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cadence Veteran Transition Tool - Veteran-Founded',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cadence - Veteran Transition Tool | Veteran-Founded & Disability-Informed',
    description: 'AI-powered transition platform created by a service-disabled veteran. Personalized plans, VA benefits guidance, housing finder, and disability resources.',
    images: ['/og-image.jpg'],
    creator: '@cadence_vets',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable}`} suppressHydrationWarning>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
            <BugReportButton />
            <ServiceWorkerRegister />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
