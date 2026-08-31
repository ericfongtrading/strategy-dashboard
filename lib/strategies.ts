export type MonthlyRow = {
  year: number;
  months: (number | null)[];
  ytd: number | null;
  isLive?: boolean;
};

export type Trade = {
  date: string;
  /** Entry date. Optional: when any trade carries one, the table shows
   *  Entered/Exited columns instead of the single Date column. */
  entryDate?: string;
  /** Instrument. Optional: single-market strategies (GC, NQ) omit it and the
   *  table hides the column. Multi-coin strategies must set it, or every row
   *  reads as the same trade. */
  symbol?: string;
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
  /** Optional pre-rendered chart image (e.g. signals overlaid on price).
   *  Render with a transparent background for the dark modal. */
  chartImg?: string;
  chartImgLabel?: string;
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
    cagr: '19.6%',
    cagrNum: 0.196,
    sharpe: '1.30',
    maxDD: '-25.0%',
    maxDDNum: 0.25,
    status: 'live',
    description: 'Multi-sleeve intraday system on Hang Seng Index futures, combining higher-timeframe structure with intraday momentum and mean-reversion entries, and rule-based exits. Single-contract sizing, no compounding, on a fixed capital base. Headline covers 2022 onward; full-history figures below.',
    dataSource: 'Backtest 2022-2026 (4.6 yr) | Live: Apr 2026',
    backtestStart: 2022,
    backtestEnd: 2026,
    liveStart: 2026,
    liveStartMonth: 4,
    highlights: [
      'Headline basis is 2022 onward. Over the full 2019-2026 record the same code returns 8.1% CAGR at -25% DD with Sharpe 0.77.',
      'Walk-forward tested out-of-sample: parameter selection carries forward, not curve-fitted.',
      'Worst drawdown lasted 651 days (Jul 2021 -> May 2023).',
      'Runs unattended 24/5 on a VPS against the IB Gateway API, with server-side stops so a disconnect cannot leave a position unprotected',
    ],
    monthlyReturns: [
      { year: 2022, months: [8.3, -3.5, -5.5, -3.3, 1.6, 4.1, 3.3, -1.3, -2.5, 2.5, 2.5, -0.7], ytd: 5.5 },
      { year: 2023, months: [-8.5, -0.7, 0.2, -4.9, 6.1, 3.6, -0.2, -1.0, 8.8, 0.8, 7.4, -0.8], ytd: 10.8 },
      { year: 2024, months: [-0.7, 13.0, 3.1, -0.7, 3.2, -3.2, 3.1, -2.0, 5.2, 32.5, 2.0, -1.2], ytd: 54.3 },
      { year: 2025, months: [2.1, 5.7, 5.4, -0.7, -0.9, 9.6, 2.2, 2.9, 11.3, -3.0, -5.9, 1.9], ytd: 30.6 },
      { year: 2026, months: [2.4, 11.8, 8.5, 1.6, 3.7, 6.7, -2.8, -3.5, null, null, null, null], ytd: 28.4, isLive: true },
    ],
    recentTrades: [
      { date: '2026-08-28', direction: 'Short', entry: '25,298', exit: '25,388', pnl: '-HK$1,800', pnlNum: -1800, rMultiple: '-1.0R' },
      { date: '2026-08-27', direction: 'Short', entry: '25,539', exit: '25,586', pnl: '-HK$940', pnlNum: -940, rMultiple: '-0.5R' },
      { date: '2026-08-27', direction: 'Short', entry: '25,523', exit: '25,555', pnl: '-HK$1,600', pnlNum: -1600, rMultiple: '-0.6R' },
      { date: '2026-08-26', direction: 'Long', entry: '25,785', exit: '25,787', pnl: '+HK$40', pnlNum: 40, rMultiple: '+0.0R' },
      { date: '2026-08-24', direction: 'Short', entry: '25,442', exit: '25,492', pnl: '-HK$2,500', pnlNum: -2500, rMultiple: '-1.0R' },
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
    dataSource: 'Backtest: 2020-2026 (6.6 yr) | Live: Aug 2026',
    backtestStart: 2020,
    backtestEnd: 2026,
    liveStart: 2026,
    liveStartMonth: 8,
    highlights: [
      'Profit factor 1.23 across 4,298 trades (~650/yr)',
      'Walk-forward validated + independently replicated by a third-party review',
      'Live on IB since Aug 2026  -  trade feed below shows real fills, not signals',
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
    cagr: '12.0%',
    cagrNum: 0.120,
    sharpe: '1.34',
    maxDD: '-12.7%',
    maxDDNum: 0.127,
    status: 'live',
    description: 'Systematic momentum strategy on E-mini Nasdaq-100 futures, four regime-gated sleeves at a fixed 5 MNQ on a $22,500 base. Executed live on Interactive Brokers from a self-hosted VPS: automated order routing, server-side OCA brackets that survive disconnects, watchdog auto-recovery and daily reconciliation of fills against the model.',
    dataSource: 'Backtest: 2021-2026 (5 yr) | Live: Jul 2026',
    backtestStart: 2021,
    backtestEnd: 2026,
    liveStart: 2026,
    liveStartMonth: 7,
    highlights: [
      'Live automated execution on IB from a 24/7 VPS: IB Gateway + IBC auto-login, server-side GTC/OCA brackets, per-strategy clientId isolation, cron watchdogs with auto-restart',
      'Every live fill reconciled trade-by-trade against the model: entries matched at identical signal prices, zero missed signals, and the P&L decomposition closes to the cent',
      'Reconciliation surfaced a stale-data bug that had produced one bad regime read — diagnosed, fixed, and now guarded by a daily cross-source price check',
      'Returns net of MEASURED execution cost ($5.40/contract round-turn, incl. 1.88pt slippage) rather than a commission-only assumption',
      'Positive in every year of the 5-year test, including the 2022 bear market',
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
    cagr: '8.9%',
    cagrNum: 0.089,
    sharpe: '1.07',
    maxDD: '-16.4%',
    maxDDNum: 0.164,
    status: 'live',
    description: 'Systematic mean reversion on a selected basket of FX crosses. Fades statistically stretched moves back toward equilibrium, with volatility-scaled stops and a hard time limit on every position. Fixed fractional risk per trade, compounding. Returns are net of measured execution costs.',
    dataSource: 'Backtest 2017-2026 (9.4 yr) | Live: Apr 2026',
    backtestStart: 2017,
    backtestEnd: 2026,
    liveStart: 2026,
    liveStartMonth: 4,
    highlights: [
      '+123.3% cumulative over 9.4 years across several thousand trades',
      'Costed with live-sampled spreads, not idealised fills',
      'Two losing years shown (2018 -6.7%, 2019 -4.5%) rather than omitted',
      'Concurrency limits prevent stacked exposure to the same currency',
      'Apr 2026 onward is modelled on live broker feed data',
      'Runs unattended 24/5 on a VPS against the IB Gateway API, with server-side stops so a disconnect cannot leave a position unprotected',
    ],
    monthlyReturns: [
      { year: 2017, months: [-1.8, 0.2, 2.0, -4.1, 3.9, -0.2, 2.2, 1.0, 2.0, 1.2, 1.5, 1.5], ytd: 9.4 },
      { year: 2018, months: [-2.7, 4.8, -1.6, -2.7, -3.6, 1.2, 2.6, -4.5, 1.1, 0.3, -4.9, 3.3], ytd: -6.7 },
      { year: 2019, months: [0.2, 2.5, 0.5, -0.9, -2.0, -0.2, -5.1, 2.7, -0.2, -0.6, -0.8, -0.6], ytd: -4.5 },
      { year: 2020, months: [-2.5, 0.5, 0.5, 2.0, -1.6, 2.5, 4.4, 0.5, -3.8, 2.5, 3.2, 0.9], ytd: 9.1 },
      { year: 2021, months: [1.6, -0.1, -0.3, 0.9, 3.0, 3.2, -2.9, -1.2, -0.1, 1.1, 2.0, 0.6], ytd: 7.8 },
      { year: 2022, months: [-1.8, -1.7, -4.1, 2.3, 1.5, 2.2, 3.8, -0.8, 1.0, 4.1, 0.2, 4.4], ytd: 11.1 },
      { year: 2023, months: [1.4, 0.2, 3.3, 3.2, -1.5, 3.8, 2.1, 0.2, 4.3, 2.5, 0.7, 4.4], ytd: 24.6 },
      { year: 2024, months: [-0.5, 2.3, 0.9, -2.3, -1.0, 1.7, -5.6, 1.5, 4.5, 4.6, 3.7, 0.7], ytd: 10.5 },
      { year: 2025, months: [-0.6, 1.0, 3.0, 1.0, 4.6, 2.3, 2.8, 0.1, -0.6, 1.2, 1.0, -0.5], ytd: 15.3 },
      { year: 2026, months: [-1.3, 2.0, 3.5, 1.5, -0.1, -2.1, 2.6, 1.3, null, null, null, null], ytd: 7.4, isLive: true },
    ],
    recentTrades: [
      { date: '2026-08-27', direction: 'Long', entry: '0.93792', exit: '0.93696', pnl: '+$182', pnlNum: 182, rMultiple: '+0.4R' },
      { date: '2026-08-27', direction: 'Long', entry: '1.89784', exit: '1.88928', pnl: '-$609', pnlNum: -609, rMultiple: '-1.0R' },
      { date: '2026-08-25', direction: 'Short', entry: '0.98728', exit: '0.98991', pnl: '-$314', pnlNum: -314, rMultiple: '-0.5R' },
      { date: '2026-08-21', direction: 'Long', entry: '0.93262', exit: '0.93629', pnl: '+$536', pnlNum: 536, rMultiple: '+1.0R' },
      { date: '2026-08-18', direction: 'Long', entry: '1.90274', exit: '1.90873', pnl: '+$541', pnlNum: 541, rMultiple: '+0.9R' },
    ],
  },
  {
    id: 'options',
    name: 'Options Premium',
    asset: 'BTC Options (Deribit)',
    category: 'crypto',
    edge: 'Volatility',
    cagr: '23.5%',
    cagrNum: 0.235,
    sharpe: '0.95',
    maxDD: '-9.3%',
    maxDDNum: 0.093,
    status: 'live',
    description: 'Systematic options premium selling on BTC via Deribit, governed by a proprietary cycle-phase regime model with two-tier expiry structure. ALL figures are BTC-denominated  -  pure options alpha, no spot beta. Headline metrics and the monthly table are live performance since Jun 2022, deposit-adjusted (unitized NAV), positions carried per the trading plan; drawdown is stated for the current era (since 2024).',
    dataSource: 'Live since Jun 2022 | all figures BTC-denominated',
    backtestStart: 2021,
    backtestEnd: 2026,
    liveStart: 2022,
    highlights: [
      'Live (all versions, since Jun 2022): +23.5% CAGR, +144% cumulative, max DD since 2024: -9.3%',
      '34 of 51 live months positive',
    ],
    monthlyReturns: [
      { year: 2022, months: [null, null, null, null, null, 37.1, 2.9, 3.3, 1.1, 2.0, -13.3, 5.8], ytd: 37.8, isLive: true },
      { year: 2023, months: [-8.4, 1.9, 2.0, 3.6, 5.3, 0.9, -3.7, 0.3, -6.3, 13.6, 2.6, 13.5], ytd: 25.4, isLive: true },
      { year: 2024, months: [-5.5, 10.6, 19.6, 3.8, -1.1, 0.0, 2.3, -4.9, 2.0, 6.2, -0.8, -0.7], ytd: 33.1, isLive: true },
      { year: 2025, months: [0.9, -3.7, 0.5, 0.3, -0.6, 0.3, 1.0, -0.1, -0.1, 3.3, -0.7, -0.9], ytd: 0.1, isLive: true },
      { year: 2026, months: [2.7, 4.0, 3.6, 2.1, 1.8, -0.8, 0.6, -7.6, null, null, null, null], ytd: 5.9, isLive: true },
    ],
  },
  {
    id: 'btc-lsr',
    name: 'Long/Short Ratio',
    asset: 'BTC',
    category: 'crypto',
    edge: 'Exchange Data',
    cagr: '27.8%',
    cagrLabel: 'CAGR (since first trade)',
    cagrNum: 0.278,
    sharpe: '1.84',
    maxDD: '-7.2%',
    maxDDNum: 0.072,
    status: 'live',
    description: 'Directional BTC strategy using the coefficient between buyers and sellers to identify regime shifts and market bottoms. Card metrics are the signal record at 40% of equity per signal, unlevered (cash otherwise idle). CAGR is measured from the first signal (Dec 2022); the same curve compounds at 21.4% from Jan 2022 and 16.7% from 2014. Trading live since Apr 2025 - live entries tracked the signals within 0.02-1.2%, verified against exchange order IDs.',
    dataSource: 'Signals: 2022-2026 (4.7 yr) | Live: Apr 2025',
    backtestStart: 2022,
    backtestEnd: 2026,
    liveStart: 2025,
    liveStartMonth: 4,
    highlights: [
      'Entered within days of the Dec-2022 ($16.9K), Sep-2024 ($57K) and Jul-2026 ($60K) lows',
      'Walk-forward validated with bootstrap drawdown analysis',
      'Live entries within 0.02-1.2% of signal price, exchange-order-ID verified',
    ],
    monthlyReturns: [
      { year: 2022, months: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.9], ytd: -0.9 },
      { year: 2023, months: [15.7, 0.0, 13.0, -2.1, 0.0, 0.0, 0.0, -1.1, -1.0, 11.0, 4.0, 3.9], ytd: 50.6 },
      { year: 2024, months: [0.0, 0.0, 0.0, -2.0, 0.0, 0.0, 0.0, 3.6, 3.1, 4.6, 9.8, 0.0], ytd: 20.3 },
      { year: 2025, months: [0.0, 0.0, 0.0, 3.5, 4.8, 1.1, 3.7, 3.4, 0.0, 0.0, 1.6, -1.6], ytd: 17.4, isLive: true },
      { year: 2026, months: [0.0, 0.0, 0.0, 4.7, -1.6, 0.0, 1.9, 11.2, null, null, null, null], ytd: 16.8, isLive: true },
    ],
    chartImg: pdf('/charts/btc-lsr-signals-v2.png'),
    chartImgLabel: 'Strategy signals 2022-2026',
  },
  {
    id: 'yield',
    name: 'Automated Yield',
    asset: 'Stablecoins',
    category: 'crypto',
    edge: 'Carry',
    cagr: '13.6%',
    cagrNum: 0.136,
    status: 'live',
    statusLabel: 'Live',
    description: 'Automated yield-generation strategy on stablecoin balances, earning through short-term, collateralized financing at floating market rates. The system continuously reprices its offers as rate conditions shift and rolls maturing balances automatically, so interest compounds without manual intervention. Returns accrue as interest rather than price movement, with zero directional market exposure.',
    dataSource: 'Live: 2025-Present',
    backtestStart: 2024,
    backtestEnd: 2025,
    liveStart: 2025,
    highlights: [
      'Runs 24/7 unattended - no scheduled reviews or manual intervention required',
      'Continuously recalibrates offer rates and terms to prevailing market conditions',
      'Interest auto-reinvests as balances roll, compounding the position',
      'Dynamic term structure management',
    ],
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
    description: 'Five low-correlation technical strategies netted into a single account: trend, momentum, breakout, chart-pattern and a deep-drawdown crash short. Positive in all ten backtested years. Trading live since August 2026 at a small test size  -  the live sample is far too short to confirm the backtest, and the figures shown are backtest unless stated otherwise.',
    dataSource: 'Backtest 2017-2026 (8.8 yr, unlevered) | live since Aug 2026',
    backtestStart: 2017,
    backtestEnd: 2026,
    liveStart: 2026,
    highlights: [
      'Exchange-mounted stop losses + portfolio-level circuit breakers',
      'All fees and funding rates deducted',
      'Live since Aug 2026 at $5,000 sizing base  -  track record too short to draw conclusions',
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
