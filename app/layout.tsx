import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '量化策略总览',
  description: '汇总目前正在研究与运行的量化交易策略',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
