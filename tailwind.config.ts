import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', 'PingFang SC',
          'Microsoft YaHei', 'Helvetica Neue', 'Segoe UI', 'sans-serif',
        ],
      },
      colors: {
        bg: '#0a0f1c',
        panel: '#111827',
        card: '#1a2236',
        edge: '#243049',
        accent: '#22d3ee',
        accent2: '#a78bfa',
        good: '#10b981',
        bad: '#ef4444',
      },
    },
  },
  plugins: [],
};
export default config;
