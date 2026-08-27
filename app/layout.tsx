import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Strategy Dashboard — Eric Fong',
  description: 'Systematic trading strategies across futures, FX, crypto, and options',
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
