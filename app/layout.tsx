import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Header } from '@/components/Header';
import ThemeProvider from '@/components/ThemeProvider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Cadence - Veteran Transition Tool | Veteran-Founded & Disability-Informed',
  description: 'AI-powered military-to-civilian transition platform built by a service-disabled veteran. Personalized mission plans, VA benefits guidance, housing finder, and resources for every branch.',
  keywords: 'veteran transition, military to civilian, service-disabled veteran, VA benefits, transition assistance, ETS, separation, military retirement, veteran resources, disability claims, GI Bill, VA healthcare, veteran housing, transition planning',
  authors: [{ name: 'Service-Disabled Veteran Founder' }],
  creator: 'Cadence Veteran Transition Tool',
  publisher: 'Cadence',
  robots: 'index, follow',
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
      <body className={inter.variable} suppressHydrationWarning>
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
