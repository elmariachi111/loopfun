import { Inter, JetBrains_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Provider } from '@/components/provider';
import { appName, appTagline, siteUrl, twitterHandle } from '@/lib/shared';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${appName} | ${appTagline}`,
    template: `%s | ${appName}`,
  },
  description:
    'A field guide to loop engineering: patterns, hints and tools for designing agentic loops, where to run them (harnesses, microVM hosts, software factories) and the failure modes to plan for.',
  applicationName: appName,
  openGraph: {
    type: 'website',
    url: '/',
    siteName: appName,
    locale: 'en_US',
    images: { url: '/og/home/image.png', width: 1200, height: 630, alt: `${appName}: ${appTagline}` },
  },
  twitter: {
    card: 'summary_large_image',
    site: twitterHandle,
    images: { url: '/og/home/image.png', width: 1200, height: 630, alt: `${appName}: ${appTagline}` },
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen font-sans">
        <Provider>{children}</Provider>
        <Analytics />
      </body>
    </html>
  );
}
