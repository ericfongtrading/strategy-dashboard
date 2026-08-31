import type { Metadata } from 'next';
import './globals.css';

const SITE_URL = 'https://ericfongtrading.github.io/strategy-dashboard/';
const TITLE = 'Strategy Dashboard — Eric Fong';
const DESCRIPTION =
  'Systematic trading strategies across futures, FX, crypto, and options — from research through walk-forward backtesting to fully automated live execution.';

// Absolute og:image URL. LinkedIn, Slack and X refuse to build a link preview
// from a relative path, and basePath means a root-relative one resolves wrong.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: TITLE,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Strategy Dashboard — 10 live systematic strategies across gold, HSI, NQ, FX and crypto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}og-image.png`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
