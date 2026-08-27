import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#08090d',
          card: '#0f1117',
          hover: '#151821',
          modal: '#12141b',
        },
        border: {
          DEFAULT: '#1e2029',
          hover: '#2a2d38',
        },
        accent: {
          DEFAULT: '#10b981',
          dim: 'rgba(16, 185, 129, 0.15)',
        },
        good: '#10b981',
        bad: '#ef4444',
        warn: '#f59e0b',
        muted: '#6b7280',
      },
    },
  },
  plugins: [],
};
export default config;
