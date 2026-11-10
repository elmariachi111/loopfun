import { Inter, JetBrains_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Provider } from '@/components/provider';
import { appName, appTagline, siteUrl } from '@/lib/shared';
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
    'What agentic loops are, how goal loops, scheduled loops and harnesses work across Claude Code, Codex, Hermes, Antigravity and OpenClaw, and where they still fall short.',
  openGraph: {
    type: 'website',
    siteName: appName,
    images: { url: '/og/home/image.png', width: 1200, height: 630, alt: `${appName}: ${appTagline}` },
  },
  twitter: {
    card: 'summary_large_image',
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
