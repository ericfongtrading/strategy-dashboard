export type Strategy = {
  id: string;
  name: string;
  asset: string;
  category: 'tradfi' | 'crypto';
  edge: string;
  cagr?: string;
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
  },
  {
    id: 'gc',
    name: 'Intraday Momentum',
    asset: 'GC Futures',
    category: 'tradfi',
    edge: 'Technical',
    cagr: '23.5%',
    cagrNum: 0.235,
    sharpe: '1.35',
    maxDD: '-12.0%',
    maxDDNum: 0.12,
    status: 'live',
    description: 'Momentum-based intraday strategy on COMEX gold futures, capturing directional moves during high-volume sessions.',
    dataSource: 'Backtest: 2018–2026',
    backtestStart: 2018,
    backtestEnd: 2026,
    liveStart: 2026,
    highlights: [
      'Designed for the US session liquidity window',
      'Walk-forward validated with out-of-sample testing',
    ],
  },
  {
    id: 'nq',
    name: 'Index Momentum',
    asset: 'NQ Futures',
    category: 'tradfi',
    edge: 'Technical',
    cagr: '9.5%',
    cagrNum: 0.095,
    sharpe: '0.85',
    maxDD: '-18.0%',
    maxDDNum: 0.18,
    status: 'live',
    description: 'Systematic momentum strategy on E-mini Nasdaq-100 futures using ATR-normalized risk measurement.',
    dataSource: 'Backtest: 2011–2024 (13.3 yr)',
    backtestStart: 2011,
    backtestEnd: 2024,
    liveStart: 2024,
    highlights: [
      '476 trades over 13+ years of data',
      'R-multiple based performance tracking',
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
    statusLabel: 'Live Testing',
    description: 'Five low-correlation technical strategies running on a single account. Positive returns every year across 8.8 years of backtesting.',
    dataSource: 'Backtest: 2017–2026 (8.8 yr)',
    backtestStart: 2017,
    backtestEnd: 2026,
    liveStart: 2026,
    highlights: [
      'Exchange-mounted stop losses + portfolio-level circuit breakers',
      'All fees and funding rates deducted',
      'Out-of-sample CAGR: 17.1%, Sharpe: 2.35',
    ],
    pdfEn: pdf('/pdfs/technical/ta_composite_EN.pdf'),
    pdfZh: pdf('/pdfs/technical/ta_composite_ZH.pdf'),
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
