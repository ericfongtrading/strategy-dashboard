export type MonthlyRow = {
  year: number;
  months: (number | null)[];
  ytd: number | null;
  isLive?: boolean;
};

export type Trade = {
  date: string;
  direction: 'Long' | 'Short';
  entry: string;
  exit: string;
  pnl: string;
  pnlNum: number;
  rMultiple?: string;
};

export type Position = {
  symbol: string;
  direction: 'Long' | 'Short';
  entry: string;
  current: string;
  size: string;
  pnl: string;
  pnlNum: number;
};

export type Strategy = {
  id: string;
  name: string;
  asset: string;
  category: 'tradfi' | 'crypto';
  edge: string;
  cagr?: string;
  cagrLabel?: string;
  cagrNum?: number;
  sharpe?: string;
  maxDD?: string;
  maxDDNum?: number;
  status: 'live' | 'backtest' | 'active' | 'development';
  statusLabel?: string;
  description: string;
  dataSource?: string;
  highlights?: string[];
  pdfEn?: string;
  pdfZh?: string;
  proofUrl?: string;
  proofLabel?: string;
  backtestStart?: number;
  backtestEnd?: number;
  liveStart?: number;
  liveStartMonth?: number;
  monthlyReturns?: MonthlyRow[];
  recentTrades?: Trade[];
  positions?: Position[];
};

const bp = process.env.NEXT_PUBLIC_BASE_PATH || '';
const pdf = (p: string) => `${bp}${p}`;

export const strategies: Strategy[] = [
  {
    id: 'hsi',
    name: 'Intraday Multi-Strategy',
    asset: 'HSI Futures',
    category: 'tradfi',
    edge: 'Technical',
    cagr: '38.0%',
    cagrNum: 0.38,
    sharpe: '1.84',
    maxDD: '-8.5%',
    maxDDNum: 0.085,
    status: 'live',
    description: 'Multi-strategy intraday system on Hang Seng Index futures combining momentum, mean reversion, and pattern recognition across multiple timeframes.',
    dataSource: 'Backtest: 2019–2026 (7 yr)',
    backtestStart: 2019,
    backtestEnd: 2026,
    liveStart: 2026,
    highlights: [
      'Positive returns every calendar year since 2019',
      'ATR-normalized position sizing with portfolio-level risk controls',
      'Automated execution via IB Gateway API',
    ],
    monthlyReturns: [
      { year: 2019, months: [3.2, 1.8, -0.5, 4.1, 2.3, -1.2, 5.6, 3.1, -0.8, 2.7, 4.3, 1.9], ytd: 29.8 },
      { year: 2020, months: [2.1, -3.2, 8.5, 5.2, 1.6, 3.8, -1.4, 4.7, 2.3, 3.1, 5.9, 2.8], ytd: 41.2 },
      { year: 2021, months: [4.3, 2.7, 1.5, -2.1, 3.8, 4.2, -0.6, 3.4, 1.9, 2.8, 3.6, 1.1], ytd: 30.1 },
      { year: 2022, months: [1.8, -1.5, 3.2, 5.7, -0.9, 2.4, 4.1, -2.3, 3.6, 1.7, 4.8, 2.1], ytd: 28.3 },
      { year: 2023, months: [3.5, 2.1, -1.8, 4.6, 3.2, 1.4, -0.3, 5.1, 2.8, 3.9, 1.6, 4.2], ytd: 35.6 },
      { year: 2024, months: [2.9, 3.8, 1.2, -1.6, 4.5, 2.7, 3.3, -0.7, 4.1, 2.4, 5.3, 1.8], ytd: 34.9 },
      { year: 2025, months: [4.1, 2.5, 3.7, -0.4, 3.9, 2.1, 4.8, 1.6, -1.2, 3.5, 2.9, 3.8], ytd: 37.2 },
      { year: 2026, months: [3.6, 2.8, 4.2, 1.9, 3.1, -0.5, 2.7, null, null, null, null, null], ytd: 19.4, isLive: true },
    ],
    recentTrades: [
      { date: '2026-08-25', direction: 'Long', entry: '17,842', exit: '17,931', pnl: '+$4,450', pnlNum: 4450, rMultiple: '+1.8R' },
      { date: '2026-08-22', direction: 'Short', entry: '17,965', exit: '17,881', pnl: '+$4,200', pnlNum: 4200, rMultiple: '+1.5R' },
      { date: '2026-08-21', direction: 'Long', entry: '17,710', exit: '17,688', pnl: '-$1,100', pnlNum: -1100, rMultiple: '-0.4R' },
      { date: '2026-08-20', direction: 'Long', entry: '17,654', exit: '17,798', pnl: '+$7,200', pnlNum: 7200, rMultiple: '+2.6R' },
      { date: '2026-08-19', direction: 'Short', entry: '17,823', exit: '17,790', pnl: '+$1,650', pnlNum: 1650, rMultiple: '+0.6R' },
    ],
    positions: [
      { symbol: 'MHI Aug 2026', direction: 'Long', entry: '17,856', current: '17,912', size: '2 lots', pnl: '+$560', pnlNum: 560 },
    ],
  },
  {
    id: 'gc',
    name: 'Intraday Momentum',
    asset: 'GC Futures',
    category: 'tradfi',
    edge: 'Technical',
    cagr: '29.5%',
    cagrNum: 0.295,
    sharpe: '1.50',
    maxDD: '-12.5%',
    maxDDNum: 0.125,
    status: 'live',
    description: 'Systematic momentum strategy on COMEX gold futures. Trades the Asia/London and US sessions, pyramiding up to 4 positions in a confirmed trend. Compounded return +445% over 6.6 years with every calendar year positive. Returns are % of contract notional, compounded.',
    dataSource: 'Backtest: 2020–2026 (6.6 yr) · Live: Aug 2026',
    backtestStart: 2020,
    backtestEnd: 2026,
    liveStart: 2026,
    liveStartMonth: 8,
    highlights: [
      'Profit factor 1.23 across 4,298 trades (~650/yr)',
      'Walk-forward validated + independently replicated by a third-party review',
      'Live on IB since Aug 2026 — trade feed below shows real fills, not signals',
    ],
    monthlyReturns: [
      { year: 2019, months: [null, null, null, null, null, null, null, null, null, null, null, 1.6], ytd: 1.6 },
      { year: 2020, months: [5.6, 10.9, 1.8, 3.9, 3.1, 4.8, 13.9, 2.5, -4.7, -0.8, 0.7, -0.3], ytd: 48.3 },
      { year: 2021, months: [-2.8, 7.8, 1.4, -3.2, 12.3, -3.1, -4.2, -1.9, -1.4, -2.6, 3.1, -1.2], ytd: 2.9 },
      { year: 2022, months: [0.9, 6.0, 2.4, -0.6, 1.7, 1.5, 2.1, 0.2, 3.4, -1.0, -3.1, 5.5], ytd: 20.3 },
      { year: 2023, months: [4.1, -2.6, -1.2, 3.6, 3.6, 0.9, -4.0, -6.7, 9.0, -2.3, 3.8, 9.5], ytd: 17.6 },
      { year: 2024, months: [-6.1, -2.7, 13.6, -0.4, -3.1, 2.2, 0.4, -1.7, 4.8, 2.7, -4.0, 5.8], ytd: 10.5 },
      { year: 2025, months: [4.6, 2.2, 8.1, 8.5, -0.3, 1.4, 7.2, 5.6, 6.1, 0.0, 5.4, -3.6], ytd: 54.7 },
      { year: 2026, months: [24.4, 1.9, -5.2, 2.8, 6.1, 11.3, -0.1, null, null, null, null, null], ytd: 45.7, isLive: true },
    ],
  },
  {
    id: 'nq',
    name: 'Index Momentum',
    asset: 'NQ Futures',
    category: 'tradfi',
    edge: 'Technical',
    cagr: '15.9%',
    cagrNum: 0.159,
    sharpe: '1.93',
    maxDD: '-11.6%',
    maxDDNum: 0.116,
    status: 'live',
    description: 'Systematic momentum strategy on E-mini Nasdaq-100 futures. Fixed 5 MNQ contracts on $22,500 base. Total return +109% over 5 years with 70% positive months.',
    dataSource: 'Backtest: 2021–2026 (5 yr) · Live: Jul 2026',
    backtestStart: 2021,
    backtestEnd: 2026,
    liveStart: 2026,
    liveStartMonth: 7,
    highlights: [
      'Sortino: 2.96, profit factor: 1.57, annualized vol: 10.8%',
      'Consistent 13–18% yearly returns including 2022 bear market',
      '70% positive months across 5 years of data',
    ],
    monthlyReturns: [
      { year: 2021, months: [null, null, null, null, null, null, null, 1.2, 2.2, 0.7, -1.1, -0.1], ytd: 2.9 },
      { year: 2022, months: [-0.1, 0.5, 3.4, 1.3, 1.7, 0.3, 3.4, -0.8, 1.3, 1.3, 0.3, 0.7], ytd: 14.0 },
      { year: 2023, months: [0.1, 2.5, 2.7, 0.1, 0.2, 2.6, -0.8, -1.7, -0.1, 3.9, 1.5, 2.0], ytd: 13.7 },
      { year: 2024, months: [2.1, -0.8, 2.0, 1.6, -0.4, -0.6, -1.0, -1.8, 5.0, 1.8, 2.0, 2.7], ytd: 13.1 },
      { year: 2025, months: [3.3, 3.5, -1.0, 1.4, 4.8, -1.3, -0.0, 2.3, 1.2, 1.5, 1.8, -0.9], ytd: 17.7 },
      { year: 2026, months: [0.3, 2.4, 0.4, 3.2, 6.0, 6.3, -0.1, -1.8, null, null, null, null], ytd: 17.7, isLive: true },
    ],
  },
  {
    id: 'fx',
    name: 'Mean Reversion',
    asset: 'FX Pairs',
    category: 'tradfi',
    edge: 'Statistical',
    cagr: '8.3%',
    cagrNum: 0.083,
    sharpe: '0.96',
    maxDD: '-11.5%',
    maxDDNum: 0.115,
    status: 'live',
    description: 'Statistical mean reversion across major and cross FX pairs, exploiting short-term deviations from equilibrium.',
    dataSource: 'Live: 2017–2024 (7.4 yr)',
    backtestStart: 2015,
    backtestEnd: 2017,
    liveStart: 2017,
    highlights: [
      '+80.1% cumulative return over 7.4 years',
      '19,000+ trades across multiple currency pairs',
      'Account-level equity curve with verified statements',
    ],
  },
  {
    id: 'options',
    name: 'Options Premium',
    asset: 'BTC Options',
    category: 'crypto',
    edge: 'Volatility',
    cagr: '80.0%',
    cagrNum: 0.80,
    maxDD: '-8.0%',
    maxDDNum: 0.08,
    status: 'active',
    description: 'Systematic options selling strategy on BTC, structured around macro regime shifts and the Bitcoin halving cycle.',
    dataSource: 'Live: 2021–2026 (5 yr)',
    backtestStart: 2019,
    backtestEnd: 2021,
    liveStart: 2021,
    highlights: [
      '+338% cumulative return (BTC-denominated)',
      'Account statements available for verification',
    ],
    pdfEn: pdf('/pdfs/options/btc_deribit_EN.pdf'),
    pdfZh: pdf('/pdfs/options/btc_deribit_ZH.pdf'),
  },
  {
    id: 'btc-lsr',
    name: 'Long/Short Ratio',
    asset: 'BTC',
    category: 'crypto',
    edge: 'Exchange Data',
    cagr: '17.3%',
    cagrNum: 0.173,
    sharpe: '1.45',
    maxDD: '-16.0%',
    maxDDNum: 0.16,
    status: 'live',
    description: 'Directional BTC strategy using the coefficient between buyers and sellers to identify regime shifts and market bottoms.',
    dataSource: 'Backtest: 2022–2025 (3 yr)',
    backtestStart: 2022,
    backtestEnd: 2025,
    liveStart: 2025,
    highlights: [
      'Successfully identified bottoms across all market regimes',
      'Walk-forward validated with bootstrap drawdown analysis',
    ],
    pdfEn: pdf('/pdfs/onchain/btc_lsr_EN.pdf'),
    pdfZh: pdf('/pdfs/onchain/btc_lsr_ZH.pdf'),
  },
  {
    id: 'yield',
    name: 'Delta-Neutral Yield',
    asset: 'Stablecoins',
    category: 'crypto',
    edge: 'Arbitrage',
    cagr: '13.6%',
    cagrNum: 0.136,
    maxDD: '-1.0%',
    maxDDNum: 0.01,
    status: 'active',
    statusLabel: 'Live',
    description: 'Automated delta-neutral yield strategy capturing funding rate differentials with minimal directional exposure.',
    dataSource: 'Live: 2025–Present',
    backtestStart: 2024,
    backtestEnd: 2025,
    liveStart: 2025,
    highlights: [
      'Fully automated 24/7 execution',
      'Dynamic term structure management',
    ],
    proofUrl: pdf('/yield/usd_yield_proof.html'),
    proofLabel: 'Live Account Record',
  },
  {
    id: 'ta-composite',
    name: 'TA Composite',
    asset: 'BTC + Altcoins',
    category: 'crypto',
    edge: 'Technical',
    cagr: '10.6%',
    cagrNum: 0.106,
    sharpe: '1.66',
    maxDD: '-5.7%',
    maxDDNum: 0.057,
    status: 'live',
    statusLabel: 'Live (small-size test)',
    description: 'Five low-correlation technical strategies netted into a single account: trend, momentum, breakout, chart-pattern and a deep-drawdown crash short. Positive in all ten backtested years. Trading live since August 2026 at a small test size — the live sample is far too short to confirm the backtest, and the figures shown are backtest unless stated otherwise.',
    dataSource: 'Backtest 2017–2026 (8.8 yr, unlevered) · live since Aug 2026',
    backtestStart: 2017,
    backtestEnd: 2026,
    liveStart: 2026,
    highlights: [
      'Exchange-mounted stop losses + portfolio-level circuit breakers',
      'All fees and funding rates deducted',
      'Live since Aug 2026 at $5,000 sizing base — track record too short to draw conclusions',
      'Out-of-sample 2022-2026: CAGR 9.0%, Sharpe 1.56',
      'Levered equivalent at 2.36x gross: CAGR 26.0%, maxDD -13.0%',
    ],
    liveStartMonth: 8,
    monthlyReturns: [
      { year: 2017, months: [null, null, null, null, null, null, null, 0.0, 0.07, 4.14, 4.08, 6.68], ytd: 15.7 },
      { year: 2018, months: [3.19, -0.05, 2.64, 1.68, 1.65, 1.13, 1.46, 2.77, -2.93, -0.97, 4.87, -2.84], ytd: 13.0 },
      { year: 2019, months: [0.35, 0.8, 0.42, 1.7, 5.56, 1.32, 0.05, -0.75, -0.57, -0.2, -0.09, -0.23], ytd: 8.51 },
      { year: 2020, months: [2.38, 0.04, 0.49, 0.67, 0.53, -2.13, 2.31, -0.58, 0.05, 6.01, 1.29, 0.71], ytd: 12.18 },
      { year: 2021, months: [0.97, 0.48, -0.28, -0.17, -1.29, 0.36, -0.17, 2.36, -1.81, 2.54, 0.53, 0.69], ytd: 4.2 },
      { year: 2022, months: [2.34, 1.26, 1.49, 0.19, 3.78, 4.08, -0.95, -1.34, -0.48, -1.32, 1.62, 0.68], ytd: 11.76 },
      { year: 2023, months: [6.22, -0.28, 1.26, 0.28, -0.41, 2.28, -0.41, -1.49, 0.12, 3.63, -0.16, 1.52], ytd: 13.03 },
      { year: 2024, months: [-0.17, 2.15, 0.01, -0.04, 0.06, -0.64, 1.01, 0.86, 0.34, -0.44, 2.56, 0.66], ytd: 6.49 },
      { year: 2025, months: [-2.07, 2.45, -0.12, -0.07, 3.05, 0.12, -0.7, -0.7, -0.75, -0.06, 0.86, -0.52], ytd: 1.38 },
      { year: 2026, months: [3.56, 1.75, -0.64, -1.2, 0.82, 4.81, -0.04, -0.22, null, null, null, null], ytd: 9.0 },
    ],

  },
  {
    id: 'ml',
    name: 'ML Signal Engine',
    asset: 'Crypto',
    category: 'crypto',
    edge: 'Machine Learning',
    status: 'development',
    description: 'AI-driven trade signal generation using technical, sentiment, and exchange data. Deep learning models trained on historical patterns.',
    highlights: [
      'Multi-source data pipeline: order books, sentiment, on-chain',
      'Feature engineering and model iteration in progress',
    ],
  },
];
